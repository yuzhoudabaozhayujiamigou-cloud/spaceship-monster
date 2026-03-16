import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1',
});

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    console.log('[3D Params] Received prompt:', prompt);

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: 'Invalid prompt' },
        { status: 400 }
      );
    }

    console.log('[3D Params] Calling OpenAI API...');
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `你是一个 3D 可视化参数生成器。根据用户输入的文字，生成适合的 3D 球体参数。

参数说明：
- color: 十六进制颜色代码（如 #3b82f6）
- distort: 扭曲强度，范围 0.1-1.5（数值越大变形越剧烈）
- speed: 动画速度，范围 1-8（数值越大动画越快）
- autoRotate: 是否自动旋转（true/false）
- autoRotateSpeed: 旋转速度，范围 1-10

根据输入文字的情感、主题、节奏来选择参数：
- 平静、稳定的主题：低 distort (0.2-0.4)、慢 speed (1-3)、蓝色/绿色
- 激烈、快速的主题：高 distort (0.8-1.2)、快 speed (5-8)、红色/橙色
- 神秘、深邃的主题：中等 distort (0.5-0.7)、中速 speed (3-5)、紫色/深蓝
- 自然、生命的主题：中等 distort (0.4-0.6)、中速 speed (2-4)、绿色/青色

只返回 JSON 格式，不要其他文字。`,
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.8,
    });

    const result = completion.choices[0]?.message?.content;
    if (!result) {
      throw new Error('No response from OpenAI');
    }

    console.log('[3D Params] OpenAI response:', result);

    const params = JSON.parse(result);

    // 验证参数
    const validatedParams = {
      color: params.color || '#3b82f6',
      distort: Math.max(0.1, Math.min(1.5, params.distort || 0.5)),
      speed: Math.max(1, Math.min(8, params.speed || 2)),
      autoRotate: params.autoRotate !== false,
      autoRotateSpeed: Math.max(1, Math.min(10, params.autoRotateSpeed || 2)),
    };

    console.log('[3D Params] Validated params:', validatedParams);

    return NextResponse.json({ params: validatedParams });
  } catch (error) {
    console.error('[3D Params] Error:', error);

    // 返回默认参数
    return NextResponse.json({
      params: {
        color: '#3b82f6',
        distort: 0.5,
        speed: 2,
        autoRotate: true,
        autoRotateSpeed: 2,
      },
    });
  }
}
