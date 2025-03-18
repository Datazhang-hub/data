// 修复图片路径脚本
// 使用方法: node scripts/fix-image-paths.js

const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// 创建PostgreSQL连接池
const pool = new Pool({
  user: 'postgres',
  password: '960627',
  host: 'localhost',
  port: 5432,
  database: 'postgres',
});

// 执行查询
async function query(text, params) {
  try {
    const result = await pool.query(text, params);
    return result;
  } catch (err) {
    console.error('❌ 查询执行失败:', err);
    throw err;
  }
}

// 检查图片是否存在
function imageExists(imagePath) {
  const fullPath = path.join(process.cwd(), 'public', imagePath);
  return fs.existsSync(fullPath);
}

// 获取所有项目
async function getAllProjects() {
  try {
    const result = await query('SELECT id, title, image_url FROM projects');
    return result.rows;
  } catch (error) {
    console.error('获取项目失败:', error);
    return [];
  }
}

// 更新项目图片路径
async function updateProjectImagePath(id, newImagePath) {
  try {
    await query('UPDATE projects SET image_url = $1 WHERE id = $2', [newImagePath, id]);
    return true;
  } catch (error) {
    console.error(`更新项目 ${id} 图片路径失败:`, error);
    return false;
  }
}

// 主函数
async function main() {
  try {
    console.log('开始检查和修复项目图片路径...');
    
    // 获取所有项目
    const projects = await getAllProjects();
    console.log(`找到 ${projects.length} 个项目`);
    
    // 检查每个项目的图片路径
    let fixedCount = 0;
    for (const project of projects) {
      const { id, title, image_url } = project;
      
      // 检查图片是否存在
      if (!imageExists(image_url)) {
        console.log(`项目 "${title}" (ID: ${id}) 的图片不存在: ${image_url}`);
        
        // 尝试修复图片路径
        const fileName = path.basename(image_url);
        const possiblePaths = [
          `/images/projects/${fileName}`,
          `/images/${fileName}`,
          `/images/projects/powerbi-preview.jpg`, // 默认备用图片
        ];
        
        // 查找第一个存在的图片路径
        const validPath = possiblePaths.find(p => imageExists(p));
        
        if (validPath) {
          // 更新图片路径
          const success = await updateProjectImagePath(id, validPath);
          if (success) {
            console.log(`✅ 已修复项目 "${title}" 的图片路径: ${validPath}`);
            fixedCount++;
          }
        } else {
          console.log(`❌ 无法修复项目 "${title}" 的图片路径，所有备选路径都不存在`);
        }
      } else {
        console.log(`✓ 项目 "${title}" 的图片路径正常: ${image_url}`);
      }
    }
    
    console.log(`修复完成! 共修复了 ${fixedCount} 个项目的图片路径`);
    
  } catch (error) {
    console.error('脚本执行失败:', error);
  } finally {
    // 关闭数据库连接池
    await pool.end();
  }
}

// 执行主函数
main(); 