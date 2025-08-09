// lib/openai-client.ts
// GPT-5対応のOpenAI クライアント実装

import OpenAI from 'openai';

interface ModelConfig {
  name: string;
  maxTokens: number;
  costPer1KTokens: number;
  available: boolean;
}

const MODEL_CONFIGS: Record<string, ModelConfig> = {
  'gpt-5': {
    name: 'gpt-5',
    maxTokens: 300,
    costPer1KTokens: 0.01, // 予想価格
    available: false // GPT-5リリース時にtrue
  },
  'gpt-4o': {
    name: 'gpt-4o',
    maxTokens: 250,
    costPer1KTokens: 0.015,
    available: true
  },
  'gpt-4-turbo': {
    name: 'gpt-4-turbo',
    maxTokens: 200,
    costPer1KTokens: 0.03,
    available: true
  }
};

class SmartStocksOpenAIClient {
  private client: OpenAI;
  private usageTracker: Map<string, number> = new Map();
  
  constructor() {
    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      organization: process.env.OPENAI_ORG_ID,
    });
  }

  /**
   * GPT-5が利用可能かチェック
   */
  private async isGPT5Available(): Promise<boolean> {
    // 環境変数またはAPIチェックでGPT-5の可用性を確認
    if (process.env.ENABLE_GPT5_WHEN_AVAILABLE === 'false') {
      return false;
    }
    
    try {
      // GPT-5の利用可能性をAPIで確認（将来実装）
      const models = await this.client.models.list();
      return models.data.some(model => model.id === 'gpt-5');
    } catch {
      return false;
    }
  }

  /**
   * 重要度に応じた最適なモデルを選択
   */
  private async selectOptimalModel(importance: 'low' | 'medium' | 'high'): Promise<string> {
    const isGPT5Ready = await this.isGPT5Available();
    
    // GPT-5が利用可能で、高重要度の場合は優先使用
    if (isGPT5Ready && importance === 'high' && MODEL_CONFIGS['gpt-5'].available) {
      return 'gpt-5';
    }
    
    // フォールバック順序
    if (MODEL_CONFIGS['gpt-4o'].available) {
      return 'gpt-4o';
    }
    
    return 'gpt-4-turbo';
  }

  /**
   * 使用量制限チェック
   */
  private checkUsageLimit(model: string): boolean {
    const today = new Date().toISOString().split('T')[0];
    const dailyUsage = this.usageTracker.get(`${model}-${today}`) || 0;
    const maxDaily = parseInt(process.env.MAX_DAILY_AI_REQUESTS || '200');
    
    return dailyUsage < maxDaily;
  }

  /**
   * 使用量を記録
   */
  private recordUsage(model: string, tokens: number): void {
    const today = new Date().toISOString().split('T')[0];
    const key = `${model}-${today}`;
    const current = this.usageTracker.get(key) || 0;
    this.usageTracker.set(key, current + tokens);
  }

  /**
   * れいのセリフ生成（メインメソッド）
   */
  async generateReiDialogue(
    context: string,
    importance: 'low' | 'medium' | 'high' = 'medium'
  ): Promise<{
    dialogue: string;
    emotion: string;
    animation: string;
    model: string;
    tokens: number;
  }> {
    try {
      const model = await this.selectOptimalModel(importance);
      
      // 使用量制限チェック
      if (!this.checkUsageLimit(model)) {
        console.warn(`Daily limit reached for ${model}, using template`);
        return this.getTemplateDialogue();
      }

      const config = MODEL_CONFIGS[model];
      
      // GPT-5対応の高度なプロンプト
      const systemPrompt = this.buildSystemPrompt(model);
      const userPrompt = this.buildUserPrompt(context, importance);

      const response = await this.client.chat.completions.create({
        model: config.name,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        max_tokens: config.maxTokens,
        temperature: 0.7,
        response_format: { type: "json_object" }
      });

      const result = JSON.parse(response.choices[0].message.content || '{}');
      const tokensUsed = response.usage?.total_tokens || 0;
      
      // 使用量記録
      this.recordUsage(model, tokensUsed);
      
      return {
        dialogue: result.dialogue || 'えーっと...',
        emotion: result.emotion || 'normal',
        animation: result.animation || 'idle',
        model,
        tokens: tokensUsed
      };

    } catch (error) {
      console.error('GPT generation failed:', error);
      return this.getTemplateDialogue();
    }
  }

  /**
   * GPT-5に最適化されたシステムプロンプト
   */
  private buildSystemPrompt(model: string): string {
    const isAdvancedModel = model === 'gpt-5' || model === 'gpt-4o';
    
    return `
あなたは「れい」という22歳の女性キャラクターです。
${isAdvancedModel ? `
高度な感情理解と一貫性のある人格表現で、以下の特徴を持ちます：
- 深い共感力と細やかな感情表現
- 股価情報に基づく論理的かつ直感的なアドバイス
- ユーザーとの長期的な関係性を意識した発言
` : `
以下の基本的な特徴を持ちます：
- 親しみやすく優しい性格
- 株価情報に興味を持つ
`}

JSON形式で回答してください：
{
  "dialogue": "セリフ（100-200文字）",
  "emotion": "感情状態（normal/happy/worried/confident/shy）",
  "animation": "アニメーション（idle/wave/point/nod）"
}
`;
  }

  /**
   * コンテキストに応じたユーザープロンプト
   */
  private buildUserPrompt(context: string, importance: 'low' | 'medium' | 'high'): string {
    const contextLevel = importance === 'high' ? 'detail' : 'brief';
    
    return `
株価情報: ${context.slice(0, contextLevel === 'detail' ? 500 : 200)}

上記の情報に基づいて、れいらしく自然に反応してください。
重要度: ${importance}
${importance === 'high' ? '重要な判断を含む場合は慎重に回答' : ''}
`;
  }

  /**
   * テンプレートベースのフォールバック
   */
  private getTemplateDialogue(): {
    dialogue: string;
    emotion: string;
    animation: string;
    model: string;
    tokens: number;
  } {
    const templates = [
      { dialogue: "株価の動きって本当に興味深いですね！", emotion: "happy", animation: "nod" },
      { dialogue: "今の市場状況、少し心配になっちゃいます...", emotion: "worried", animation: "idle" },
      { dialogue: "一緒に分析してみましょうか？", emotion: "confident", animation: "point" }
    ];
    
    const selected = templates[Math.floor(Math.random() * templates.length)];
    
    return {
      ...selected,
      model: 'template',
      tokens: 0
    };
  }

  /**
   * 使用量統計取得
   */
  getUsageStats(): Record<string, number> {
    const today = new Date().toISOString().split('T')[0];
    const stats: Record<string, number> = {};
    
    for (const [key, value] of this.usageTracker.entries()) {
      if (key.includes(today)) {
        const model = key.split('-')[0];
        stats[model] = value;
      }
    }
    
    return stats;
  }
}

export const openaiClient = new SmartStocksOpenAIClient();
export default openaiClient;
