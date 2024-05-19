const Table = require("../models/tableModel");
const asyncHandler = require("express-async-handler");
const qrcode = require('qrcode');
const generateQRCode = asyncHandler(async (tableId,restaurantId) => {
    try {
        const qrData = `http:zameen.com/new-projects?table_id=${tableId}&restaurant_id=${restaurantId}`;//To be changed with actual URL
        const qrCodeImage = await qrcode.toDataURL(qrData);
        return qrCodeImage;
    }
    catch (error) {
        throw new Error('Error generating QR code');
    }
})
const addTable = asyncHandler(async ({tableNumber,capacity,restaurantId}) => {
    const status = "free"
    const table = await Table.create({
        tableNumber,
        tableCapacity:capacity,
        status
    })
    if (table) {
        const qrCode = await generateQRCode(table._id,restaurantId);
        table.qrCode = qrCode;
        await table.save();
        return table;
    }
    else {
        throw new Error ({ message: "Error while adding a new table" })
    }
});
const getTableStatus = asyncHandler(async ({tableId}) => {
    const table = await Table.findById(tableId);
    if (table) {
        return {status:table.status}
    } else {
        throw new Error ("Table not found");
    }
});

const getQRCode = asyncHandler(async (req, res) => {
    const { tableId } = req.body;
    const table = await Table.findById(tableId);
    if (table && table.qrCode) {
        const qrCodeBuffer = Buffer.from(table.qrCode.split(",")[1], 'base64');
        res.set('Content-Type', 'image/png');
        res.send(qrCodeBuffer);   
    }
    else {
        res.status(404);
        throw new Error("Code not found");
    }
});
const changeStatus = asyncHandler(async (req, res) => {
    const { tableId, status } = req.body;
    const table = await Table.findById(tableId);
    if (table) {
        table.status = status;
        await table.save();
        res.status(201).json({ 
            message:"status changed successfully "
        })
    }
    else {
        res.status(404);
        throw new Error("Unable to change status");
    }
})
const editTable = asyncHandler(async({tableId, tableNumber, tableCapacity, status}) => {
    const table = await Table.findById(tableId);
    if (table) {
        status && (table.status = status);
        tableNumber && (table.tableNumber = tableNumber);
        tableCapacity && (table.tableCapacity = tableCapacity);
        await table.save();
        return table;
    }
    else {
        throw new Error("Unable to update table");
    }
})
const deleteTable = asyncHandler(async ({ tableId }) => {
    const table = await Table.findByIdAndDelete(tableId);
    if (table) {
        return ({
            success: true,
            message: 'Table deleted successfully',
            data: table
        });
    }
    else {
        throw new Error('Table not found');
    }
})
const viewTable = asyncHandler(async (req, res) => {
    const { tableId } = req.body;
    const table = await Table.findById(tableId);
    if (table) {
        res.status(200).json({
            table
        });
    } else {
        res.status(404);
        throw new Error("Table not found");
    }
});

module.exports = {
    addTable,
    getTableStatus,
    getQRCode,
    changeStatus,
    viewTable,
    editTable,
    deleteTable
}