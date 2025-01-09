

const { Op } = require('sequelize');
const OrgMaster = require('../models/OrgMaster');
const OrgProduct = require('../models/OrgProduct');
const OrgSignatory = require('../models/OrgSignatory');
const sequelize = require('../config/database'); // Import sequelize
const { v4: uuidv4 } = require('uuid'); // Import uuid
// const { Op } = require('sequelize');



// Create Organization Master
const createOrgMaster = async (req, res) => {
    const transaction = await sequelize.transaction();
    console.log("backend3", req.body)
    try {
        const {
            organization_id,
            member_no,
            address1,
            address2,
            pin_code,
            city,
            state,
            pan_no,
            gstn_no,
            agreement_no,
            date_of_agreement,
            org_name,
            initialComment // Optional initial comment
        } = req.body;
        console.log("backend1", req.body);

        const created_by = req.user.id;
        const no_of_admins= 0;
        const no_of_products = 0;
        const no_of_signatories = 0;
        const no_of_users =0;
        // Prepare OrgMaster data
        const OrgMasterData = {
            organization_id,
            member_no,
            address1,
            address2,
            pin_code,
            city,
            state,
            pan_no,
            gstn_no,
            no_of_signatories,
            agreement_no,
            date_of_agreement,
            no_of_users,
            no_of_admins,
            no_of_products,
            org_name,
            created_by
        };
        console.log("backend2", OrgMasterData);
        // Create OrgMaster within transaction
        const newOrgMaster = await OrgMaster.create(OrgMasterData, { transaction });

        // Create initial comment if provided
        if (initialComment) {
            await Comment.create(
                {
                    content: initialComment,
                    OrgId: newOrgMaster.organization_id,
                    userId: created_by
                },
                { transaction }
            );
        }

        // Commit transaction
        await transaction.commit();

        res.status(201).json({
            message: 'OrgMaster created successfully',
            OrgMaster: newOrgMaster
        });
    } catch (error) {
        // Rollback transaction in case of error
        await transaction.rollback();

        console.error('OrgMaster creation error:', error);
        res.status(500).json({
            message: 'Failed to create OrgMaster',
            error: error.message
        });
    }
};

// Create Product
// const createProduct = async (req, res) => {


//     try {
//         const productData = req.body;

//         const product = await OrgProduct.create({
//             organization_id: productData.organization_id,
//             product_name: productData.product_name,
//             product_code: productData.product_code,
//             description: productData.description,
//             status: 1
//         });

//         res.status(201).json({
//             success: true,
//             message: 'Product created successfully',
//             data: product
//         });
//     } catch (error) {
//         console.error('Error creating product:', error);
//         res.status(500).json({
//             success: false,
//             message: 'Failed to create product',
//             error: error.message
//         });
//     }
// };

const createProduct = async (req, res) => {
    try {
        const productData = req.body;

        // Validate required fields
        const requiredFields = ['organization_id', 'product_name', 'product_code'];
        for (const field of requiredFields) {
            if (!productData[field]) {
                return res.status(400).json({
                    success: false,
                    message: `${field} is required`
                });
            }
        }

        // Start a transaction to ensure data consistency
        const result = await sequelize.transaction(async (t) => {
            // Create the product
            const product = await OrgProduct.create({
                organization_id: productData.organization_id,
                product_name: productData.product_name,
                product_code: productData.product_code,
                description: productData.description,
                status: 1
            }, { transaction: t });

            // Update the org_master table using a raw query with proper escaping
            await sequelize.query(
                `UPDATE org_master 
                 SET no_of_products = (
                    SELECT COUNT(*) 
                    FROM org_products 
                    WHERE organization_id = :orgId
                 )
                 WHERE organization_id = :orgId`,
                {
                    replacements: { orgId: productData.organization_id },
                    type: sequelize.QueryTypes.UPDATE,
                    transaction: t
                }
            );

            // Get the updated product count for the response
            // const [countResult] = await sequelize.query(
            //     `SELECT no_of_products 
            //      FROM org_master 
            //      WHERE organization_id = :orgId`,
            //     {
            //         replacements: { orgId: productData.organization_id },
            //         type: sequelize.QueryTypes.SELECT,
            //         transaction: t
            //     }
            // );

            // return { product, productCount: countResult.no_of_products };
            return {product};
        });

        res.status(201).json({
            success: true,
            message: 'Product created successfully',
            data: result.product,
            productCount: result.productCount
        });
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create product',
            error: error.message
        });
    }
};

// Create Signatory
// const createSignatory = async (req, res) => {
//     try {
//         const signatoryData = req.body;

//         // Validate required fields
//         const requiredFields = ['organization_id', 'name', 'designation', 'pan_no', 'email_id', 'mobile_no'];
//         for (const field of requiredFields) {
//             if (!signatoryData[field]) {
//                 return res.status(400).json({
//                     success: false,
//                     message: `${field} is required`
//                 });
//             }
//         }

//         const signatory = await OrgSignatory.create({
//             organization_id: signatoryData.organization_id,
//             name: signatoryData.name,
//             designation: signatoryData.designation,
//             pan_no: signatoryData.pan_no,
//             email_id: signatoryData.email_id,
//             mobile_no: signatoryData.mobile_no,
//             status: 1,
//             date_of_mobile_conf: signatoryData.date_of_mobile_conf,
//             date_of_email_conf: signatoryData.date_of_email_conf,
//             date_creation: signatoryData.date_creation || new Date()
//         });

//         res.status(201).json({
//             success: true,
//             message: 'Signatory created successfully',
//             data: signatory
//         });
//     } catch (error) {
//         console.error('Error creating signatory:', error);
//         res.status(500).json({
//             success: false,
//             message: 'Failed to create signatory',
//             error: error.message
//         });
//     }
// };

const createSignatory = async (req, res) => {
    try {
        const signatoryData = req.body;

        // Validate required fields
        const requiredFields = ['organization_id', 'name', 'designation', 'pan_no', 'email_id', 'mobile_no'];
        for (const field of requiredFields) {
            if (!signatoryData[field]) {
                return res.status(400).json({
                    success: false,
                    message: `${field} is required`
                });
            }
        }

        // Start a transaction to ensure data consistency
        const result = await sequelize.transaction(async (t) => {
            // Create the signatory
            const signatory = await OrgSignatory.create({
                organization_id: signatoryData.organization_id,
                name: signatoryData.name,
                designation: signatoryData.designation,
                pan_no: signatoryData.pan_no,
                email_id: signatoryData.email_id,
                mobile_no: signatoryData.mobile_no,
                status: 1,
                date_of_mobile_conf: signatoryData.date_of_mobile_conf,
                date_of_email_conf: signatoryData.date_of_email_conf,
                date_creation: signatoryData.date_creation || new Date()
            }, { transaction: t });

            // Update the org_master table using a raw query with proper escaping
            await sequelize.query(
                `UPDATE org_master 
                 SET no_of_signatories = (
                    SELECT COUNT(*) 
                    FROM org_signatories 
                    WHERE organization_id = :orgId
                 )
                 WHERE organization_id = :orgId`,
                {
                    replacements: { orgId: signatoryData.organization_id },
                    type: sequelize.QueryTypes.UPDATE,
                    transaction: t
                }
            );

            // Get the updated signatory count for the response
            const orgMaster = await OrgMaster.findOne({
                attributes: ['no_of_signatories'],
                where: { organization_id: signatoryData.organization_id },
                transaction: t
            });

            return { signatory, signatoryCount: orgMaster.no_of_signatories };
        });

        res.status(201).json({
            success: true,
            message: 'Signatory created successfully',
            data: result.signatory,
            signatoryCount: result.signatoryCount
        });
    } catch (error) {
        console.error('Error creating signatory:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create signatory',
            error: error.message
        });
    }
};

// Get Products by Organization ID
const getProductsByOrgId = async (req, res) => {
    try {
        const { orgId } = req.params;

        const products = await OrgProduct.findAll({
            where: {
                organization_id: orgId,
            }
        });

        res.status(200).json({
            success: true,
            data: products
        });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch products',
            error: error.message
        });
    }
};

// Get Signatories by Organization ID
const getSignatoriesByOrgId = async (req, res) => {
    try {
        const { orgId } = req.params;

        const signatories = await OrgSignatory.findAll({
            where: {
                organization_id: orgId,
            }
        });

        res.status(200).json({
            success: true,
            data: signatories
        });
    } catch (error) {
        console.error('Error fetching signatories:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch signatories',
            error: error.message
        });
    }
};

// List Organizations
const listOrganizations = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            search = '',
            sortBy = 'created_at',
            sortOrder = 'DESC'
        } = req.query;

        const offset = (page - 1) * limit;

        const whereCondition = search ? {
            [Op.or]: [
                { org_name: { [Op.like]: `%${search}%` } },
                { organization_id: { [Op.like]: `%${search}%` } }
            ]
        } : {};

        const { count, rows: organizations } = await OrgMaster.findAndCountAll({
            where: whereCondition,
            order: [[sortBy, sortOrder]],
            limit: parseInt(limit),
            offset: parseInt(offset)
        });

        res.status(200).json({
            total: count,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            organizations
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching organizations',
            error: error.message
        });
    }
};

// Update Organization
const updateOrganization = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const { orgId } = req.params;
        const updateData = req.body;

        const [updated] = await OrgMaster.update(updateData, {
            where: { organization_id: orgId },
            transaction
        });

        if (updated) {
            await transaction.commit();
            res.status(200).json({ message: 'Organization updated successfully' });
        } else {
            await transaction.rollback();
            res.status(404).json({ message: 'Organization not found' });
        }
    } catch (error) {
        await transaction.rollback();
        res.status(500).json({
            message: 'Error updating organization',
            error: error.message
        });
    }
};


const updateProducts = async (req, res) => {
    const transaction = await sequelize.transaction();

    try {
        // const { orgId } = req.params;
        const productData = req.body;

        // Handle both single product and array of products
        const products = Array.isArray(productData) ? productData : [productData];

        const updatePromises = products.map(product =>
            OrgProduct.update(
                {
                    product_name: product.product_name,
                    product_code: product.product_code,
                    description: product.description,
                    status: product.status
                },
                {
                    where: {
                        id: product.id,
                    },
                    transaction
                }
            )
        );

        await Promise.all(updatePromises);
        await transaction.commit();

        res.status(200).json({
            success: true,
            message: 'Products updated successfully'
        });
    } catch (error) {
        await transaction.rollback();
        console.error("Error updating products:", error);

        res.status(500).json({
            success: false,
            message: 'Error updating products',
            error: error.message
        });
    }
};

const updateSignatories = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const { id: signatoryId } = req.params;
        const signatoryData = req.body;

        if (!signatoryId) {
            return res.status(400).json({
                success: false,
                message: 'Signatory ID is required'
            });
        }

        const [updatedRows] = await OrgSignatory.update(
            {
                name: signatoryData.name,
                designation: signatoryData.designation,
                email_id: signatoryData.email_id,
                mobile_no: signatoryData.mobile_no,
                status: signatoryData.status
            },
            {
                where: { id: signatoryId },
                transaction
            }
        );

        if (updatedRows === 0) {
            await transaction.rollback();
            return res.status(404).json({
                success: false,
                message: 'Signatory not found'
            });
        }

        await transaction.commit();

        res.status(200).json({
            success: true,
            message: 'Signatory updated successfully'
        });

    } catch (error) {
        await transaction.rollback();
        console.error("Error updating signatory:", error);

        res.status(500).json({
            success: false,
            message: 'Error updating signatory',
            error: error.message
        });
    }
};

// Soft Delete Organization
const softDeleteOrganization = async (req, res) => {
    try {
        const { orgId } = req.params;
        console.log('Received orgId:', orgId);

        const updated = await OrgMaster.update(
            { status: 0 }, // Assuming you have a `status` column for soft deletion
            { where: { organization_id: orgId } }
        );

        console.log('Update result:', updated);

        if (updated[0] > 0) {
            res.status(200).json({ message: 'Organization soft deleted successfully' });
        } else {
            res.status(404).json({ message: 'Organization not found' });
        }
    } catch (error) {
        console.error('Error during soft delete:', error.message);
        res.status(500).json({
            message: 'Error deleting organization',
            error: error.message,
        });
    }
};

const deleteProduct=  async (req, res) => {
    try {
      const { id } = req.params;
    //   const currentUser = req.user;
  
    //   // Only IBDIC_ADMIN can delete users
    //   if (currentUser.role !== 'IBDIC_ADMIN') {
    //     return res.status(403).json({ message: 'Only IBDIC administrators can delete product' });
    //   }
  
      const product = await OrgProduct.findByPk(id);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
  
      await product.destroy();
      res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
      console.error('Error in deleteProduct:', error);
      res.status(500).json({ message: 'Error deleting Product' });
    }
  }


  const deleteSignatory=  async (req, res) => {
    try {
      const { id } = req.params;
    //   const currentUser = req.user;
  
    //   // Only IBDIC_ADMIN can delete users
    //   if (currentUser.role !== 'IBDIC_ADMIN') {
    //     return res.status(403).json({ message: 'Only IBDIC administrators can delete Signatory' });
    //   }
  
      const signatory = await OrgSignatory.findByPk(id);
      if (!signatory) {
        return res.status(404).json({ message: 'Signatory not found' });
      }
  
      await signatory.destroy();
      res.status(200).json({ message: 'Signatory deleted successfully' });
    } catch (error) {
      console.error('Error in deleteSignatory:', error);
      res.status(500).json({ message: 'Error deleting Signatory' });
    }
  }

// Export all controllers
module.exports = {
    createOrgMaster,
    createProduct,
    createSignatory,
    getProductsByOrgId,
    getSignatoriesByOrgId,
    listOrganizations,
    updateOrganization,
    updateProducts,
    updateSignatories,
    softDeleteOrganization,
    deleteSignatory,
    deleteProduct
};