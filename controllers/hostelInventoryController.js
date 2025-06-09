'use strict';

const { HostelInventory, Hostel } = require('../models');

// Create a new inventory item for a hostel
exports.createInventoryItem = async (req, res) => {
  try {
    const { itemName, quantity, hostelId, remark, assignDate } = req.body;

    // Validate required fields
    if (!itemName || !quantity || !hostelId) {
      return res.status(400).json({
        success: false,
        message: 'Item name, quantity, and hostel ID are required'
      });
    }

    // Check if hostel exists
    const hostel = await Hostel.findByPk(hostelId);
    if (!hostel) {
      return res.status(404).json({
        success: false,
        message: 'Hostel not found'
      });
    }

    // Create new inventory item
    const newInventoryItem = await HostelInventory.create({
      itemName,
      quantity,
      hostelId,
      remark: remark || null,
      assignDate: assignDate || new Date()
    });

    return res.status(201).json({
      success: true,
      message: 'Inventory item created successfully',
      data: newInventoryItem
    });
  } catch (error) {
    console.error('Error creating inventory item:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create inventory item',
      error: error.message
    });
  }
};

// Get all inventory items
exports.getAllInventoryItems = async (req, res) => {
  try {
    const inventoryItems = await HostelInventory.findAll({
      include: [
        {
          model: Hostel,
          as: 'hostel',
          attributes: ['id', 'name']
        }
      ]
    });

    return res.status(200).json({
      success: true,
      count: inventoryItems.length,
      data: inventoryItems
    });
  } catch (error) {
    console.error('Error fetching inventory items:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch inventory items',
      error: error.message
    });
  }
};

// Get inventory items by hostel ID
exports.getInventoryItemsByHostel = async (req, res) => {
  try {
    const { hostelId } = req.params;

    // Check if hostel exists
    const hostel = await Hostel.findByPk(hostelId);
    if (!hostel) {
      return res.status(404).json({
        success: false,
        message: 'Hostel not found'
      });
    }

    const inventoryItems = await HostelInventory.findAll({
      where: { hostelId },
      include: [
        {
          model: Hostel,
          as: 'hostel',
          attributes: ['id', 'name']
        }
      ]
    });

    return res.status(200).json({
      success: true,
      count: inventoryItems.length,
      data: inventoryItems
    });
  } catch (error) {
    console.error('Error fetching inventory items for hostel:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch inventory items for hostel',
      error: error.message
    });
  }
};

// Get a single inventory item by ID
exports.getInventoryItemById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const inventoryItem = await HostelInventory.findByPk(id, {
      include: [
        {
          model: Hostel,
          as: 'hostel',
          attributes: ['id', 'name']
        }
      ]
    });

    if (!inventoryItem) {
      return res.status(404).json({
        success: false,
        message: 'Inventory item not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: inventoryItem
    });
  } catch (error) {
    console.error('Error fetching inventory item:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch inventory item',
      error: error.message
    });
  }
};

// Update an inventory item
exports.updateInventoryItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { itemName, quantity, hostelId, remark, assignDate } = req.body;

    // Check if inventory item exists
    const inventoryItem = await HostelInventory.findByPk(id);
    if (!inventoryItem) {
      return res.status(404).json({
        success: false,
        message: 'Inventory item not found'
      });
    }

    // If hostelId is provided, check if hostel exists
    if (hostelId) {
      const hostel = await Hostel.findByPk(hostelId);
      if (!hostel) {
        return res.status(404).json({
          success: false,
          message: 'Hostel not found'
        });
      }
    }

    // Update inventory item
    const updatedItem = await inventoryItem.update({
      itemName: itemName || inventoryItem.itemName,
      quantity: quantity !== undefined ? quantity : inventoryItem.quantity,
      hostelId: hostelId || inventoryItem.hostelId,
      remark: remark !== undefined ? remark : inventoryItem.remark,
      assignDate: assignDate || inventoryItem.assignDate
    });

    return res.status(200).json({
      success: true,
      message: 'Inventory item updated successfully',
      data: updatedItem
    });
  } catch (error) {
    console.error('Error updating inventory item:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update inventory item',
      error: error.message
    });
  }
};

// Delete an inventory item
exports.deleteInventoryItem = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if inventory item exists
    const inventoryItem = await HostelInventory.findByPk(id);
    if (!inventoryItem) {
      return res.status(404).json({
        success: false,
        message: 'Inventory item not found'
      });
    }

    // Delete the inventory item
    await inventoryItem.destroy();

    return res.status(200).json({
      success: true,
      message: 'Inventory item deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting inventory item:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete inventory item',
      error: error.message
    });
  }
};