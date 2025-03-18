import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { mkdir } from 'fs/promises';

/**
 * 文件上传API
 * 处理项目图片上传，并保存到正确的位置
 */
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: '没有找到上传的文件' },
        { status: 400 }
      );
    }

    // 获取文件扩展名
    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    if (!['jpg', 'jpeg', 'png', 'gif'].includes(ext)) {
      return NextResponse.json(
        { error: '不支持的文件格式，请上传jpg、jpeg、png或gif格式的图片' },
        { status: 400 }
      );
    }

    // 检查文件大小 (限制为5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: '文件太大，请上传小于5MB的图片' },
        { status: 400 }
      );
    }

    // 生成唯一的文件名
    const timestamp = Date.now();
    const fileName = `project-${timestamp}.${ext}`;
    
    // 确保项目图片目录存在
    const projectsDir = join(process.cwd(), 'public', 'images', 'projects');
    try {
      await mkdir(projectsDir, { recursive: true });
    } catch (err) {
      console.log('项目图片目录已存在或创建失败:', err);
    }
    
    // 设置图片保存路径
    const filePath = join(projectsDir, fileName);

    // 将文件内容转换为Buffer并保存
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 保存文件
    await writeFile(filePath, buffer);

    // 返回文件URL（相对于public目录）
    const fileUrl = `/images/projects/${fileName}`;

    console.log('文件上传成功:', { fileName, fileUrl, size: `${(file.size / 1024).toFixed(2)}KB` });
    
    return NextResponse.json({ 
      url: fileUrl,
      success: true, 
      fileName,
      size: file.size 
    });
  } catch (error) {
    console.error('文件上传失败:', error);
    return NextResponse.json(
      { error: '文件上传失败，请稍后重试' },
      { status: 500 }
    );
  }
} 