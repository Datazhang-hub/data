import { NextResponse } from 'next/server';
import { createContact, getAllContacts } from '@/app/lib/contacts';

// 获取所有联系记录
export async function GET() {
  try {
    const contacts = await getAllContacts();
    return NextResponse.json({ contacts });
  } catch (error: any) {
    console.error('获取联系记录失败:', error);
    return NextResponse.json(
      { error: error.message || '获取联系记录失败' },
      { status: 500 }
    );
  }
}

// 创建新的联系记录
export async function POST(request: Request) {
  try {
    console.log('收到联系表单提交请求');
    const data = await request.json();
    console.log('表单数据:', data);
    
    // 验证数据
    if (!data.name || !data.email || !data.message) {
      console.error('缺少必要字段:', { name: !!data.name, email: !!data.email, message: !!data.message });
      return NextResponse.json(
        { error: '请提供姓名、邮箱和留言信息' },
        { status: 400 }
      );
    }
    
    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      console.error('邮箱格式无效:', data.email);
      return NextResponse.json(
        { error: '请提供有效的邮箱地址' },
        { status: 400 }
      );
    }
    
    // 创建联系记录
    console.log('开始创建联系记录');
    const contact = await createContact({
      name: data.name,
      email: data.email,
      company: data.company || '',
      channel: data.channel || '网站直接联系',
      message: data.message,
    });
    
    if (!contact) {
      console.error('创建联系记录失败: 返回null');
      return NextResponse.json(
        { error: '提交失败，请稍后重试' },
        { status: 500 }
      );
    }
    
    console.log('联系记录创建成功:', contact);
    return NextResponse.json({ success: true, contact });
  } catch (error: any) {
    console.error('创建联系记录失败:', error);
    return NextResponse.json(
      { error: error.message || '提交失败，请稍后重试' },
      { status: 500 }
    );
  }
} 