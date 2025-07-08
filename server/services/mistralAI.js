import axios from 'axios';

export class MistralAIClient {
  constructor() {
    this.apiKey = process.env.MISTRAL_API_KEY;
    this.apiUrl = process.env.MISTRAL_API_URL || 'https://api.mistral.ai/v1';
    this.client = axios.create({
      baseURL: this.apiUrl,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      }
    });
  }

  async generateSubjectLines({ campaignType, targetAudience, tone, keywords, count = 5 }) {
    try {
      const prompt = `Generate ${count} compelling email subject lines for a ${campaignType} campaign targeting ${targetAudience}. 
      Use a ${tone} tone and incorporate these keywords: ${keywords.join(', ')}. 
      Make them attention-grabbing and optimized for open rates.
      
      Return only the subject lines, one per line, without numbering or bullets.`;

      const response = await this.client.post('/chat/completions', {
        model: 'mistral-medium',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 200,
        temperature: 0.8
      });

      const content = response.data.choices[0].message.content;
      const subjectLines = content.split('\n').filter(line => line.trim()).slice(0, count);

      return subjectLines;
    } catch (error) {
      console.error('Mistral subject line generation error:', error.response?.data || error.message);
      throw new Error('Failed to generate subject lines');
    }
  }

  async generateContent({ prompt, tone, contentType, maxLength = 1000 }) {
    try {
      const systemPrompt = `You are a professional email marketing copywriter. Generate ${contentType} content with a ${tone} tone. 
      Keep the content under ${maxLength} characters and make it engaging and conversion-focused.`;

      const response = await this.client.post('/chat/completions', {
        model: 'mistral-medium',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: Math.min(maxLength / 2, 1000),
        temperature: 0.7
      });

      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('Mistral content generation error:', error.response?.data || error.message);
      throw new Error('Failed to generate content');
    }
  }

  async optimizeContent({ content, optimizationGoal, targetAudience }) {
    try {
      const prompt = `Optimize this email content for ${optimizationGoal} targeting ${targetAudience}:

      "${content}"

      Please rewrite it to be more effective while maintaining the original message and tone.`;

      const response = await this.client.post('/chat/completions', {
        model: 'mistral-medium',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1000,
        temperature: 0.6
      });

      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('Mistral content optimization error:', error.response?.data || error.message);
      throw new Error('Failed to optimize content');
    }
  }

  async analyzeSentiment({ content }) {
    try {
      const prompt = `Analyze the sentiment of this email content and provide a score from -1 (very negative) to 1 (very positive):

      "${content}"

      Respond with a JSON object containing:
      {
        "score": <number between -1 and 1>,
        "label": "<positive|negative|neutral>",
        "confidence": <number between 0 and 1>,
        "analysis": "<brief explanation>"
      }`;

      const response = await this.client.post('/chat/completions', {
        model: 'mistral-small',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 200,
        temperature: 0.3
      });

      const result = JSON.parse(response.data.choices[0].message.content);
      return result;
    } catch (error) {
      console.error('Mistral sentiment analysis error:', error.response?.data || error.message);
      throw new Error('Failed to analyze sentiment');
    }
  }

  async generateABVariations({ originalContent, variationType, count = 3 }) {
    try {
      const prompt = `Create ${count} A/B test variations of this email content, focusing on ${variationType}:

      Original: "${originalContent}"

      Generate variations that test different approaches while maintaining the core message. 
      Return each variation on a new line, separated by "---".`;

      const response = await this.client.post('/chat/completions', {
        model: 'mistral-medium',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1500,
        temperature: 0.8
      });

      const content = response.data.choices[0].message.content;
      const variations = content.split('---').map(v => v.trim()).filter(v => v);

      return variations.slice(0, count);
    } catch (error) {
      console.error('Mistral A/B variation generation error:', error.response?.data || error.message);
      throw new Error('Failed to generate A/B variations');
    }
  }

  async generatePersonalization({ template, customerData }) {
    try {
      const prompt = `Personalize this email template with the provided customer data:

      Template: "${template}"
      Customer Data: ${JSON.stringify(customerData)}

      Replace placeholders and add personalized touches based on the customer information.`;

      const response = await this.client.post('/chat/completions', {
        model: 'mistral-medium',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 800,
        temperature: 0.5
      });

      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('Mistral personalization error:', error.response?.data || error.message);
      throw new Error('Failed to personalize content');
    }
  }
}

export default MistralAIClient;