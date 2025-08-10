import { Router } from 'express';
const router = Router();
import Item from '../models/Item.js';
// import { find, findById, findByIdAndUpdate, findByIdAndDelete } from 'mongoose';
// import { findOne } from 'mongoose';

// 获取所有项目 - 优化分页查询
router.post('/getTableItem', async (req, res) => {
  try {
    // 验证分页参数
    const currentPage = parseInt(req.body.currentPage) || 1;
    const pageSize = parseInt(req.body.pageSize) || 10;
    console.log(currentPage, pageSize)
    if (isNaN(currentPage) || isNaN(pageSize) || currentPage < 1 || pageSize < 1) {
      return res.status(400).json({
        code: 400,
        msg: '无效的分页参数',
        data: null
      });
    }
    
    // 计算跳过的数量
    const skip = (currentPage - 1) * pageSize;
    console.log(skip)

    // 数据库层面分页查询
    const paginatedData = await Item.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize);
    console.log(paginatedData)

    // 获取总数量
    const total = await Item.countDocuments();
    
    setTimeout(() => {
      res.json({
        code: 200,
        msg: '获取成功',
        data: paginatedData,
        currentPage: currentPage,
        pageSize: pageSize,
        total: total
      });
    }, 500);

  } catch (err) {
    res.status(500).json({
      code: 500,
      msg: '服务器错误: ' + err.message,
      data: null
    });
  }
});

// 创建新项目 - 统一响应格式
router.post('/createTableItem', async (req, res) => {
  try {
    // 验证必填字段
    if (!req.body.name || typeof req.body.price !== 'number') {
      return res.status(400).json({
        code: 400,
        msg: '名称和价格是必填项，且价格必须是数字',
        data: null
      });
    }
    
    const item = new Item({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price
    });

    const newItem = await item.save();
    res.status(201).json({
      code: 201,
      msg: '创建成功',
      data: newItem
    });
  } catch (err) {
    res.status(400).json({
      code: 400,
      msg: '创建失败: ' + err.message,
      data: null
    });
  }
});

// 获取单个项目 - 统一响应格式
router.get('/:id', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({
        code: 404,
        msg: '项目不存在',
        data: null
      });
    }
    res.json({
      code: 200,
      msg: '获取成功',
      data: item
    });
  } catch (err) {
    res.status(500).json({
      code: 500,
      msg: '服务器错误: ' + err.message,
      data: null
    });
  }
});

// 更新项目 - 统一响应格式
router.put('/:id', async (req, res) => {
  try {
    // 验证更新字段
    if (!req.body.name && typeof req.body.price === 'undefined') {
      return res.status(400).json({
        code: 400,
        msg: '至少需要提供名称或价格进行更新',
        data: null
      });
    }
    
    const updatedItem = await Item.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        description: req.body.description,
        price: req.body.price
      },
      { new: true, runValidators: true }
    );
    
    if (!updatedItem) {
      return res.status(404).json({
        code: 404,
        msg: '项目不存在',
        data: null
      });
    }
    
    res.json({
      code: 200,
      msg: '更新成功',
      data: updatedItem
    });
  } catch (err) {
    res.status(400).json({
      code: 400,
      msg: '更新失败: ' + err.message,
      data: null
    });
  }
});

// 删除项目 - 统一响应格式
router.delete('/:id', async (req, res) => {
  try {
    const deletedItem = await Item.findByIdAndDelete(req.params.id);
    if (!deletedItem) {
      return res.status(404).json({
        code: 404,
        msg: '项目不存在',
        data: null
      });
    }
    res.json({
      code: 200,
      msg: '删除成功',
      data: deletedItem
    });
  } catch (err) {
    res.status(500).json({
      code: 500,
      msg: '服务器错误: ' + err.message,
      data: null
    });
  }
});

export default router;