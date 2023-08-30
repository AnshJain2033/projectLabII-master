import pg from 'pg'
export const deleteCategoryController = async (req, res) => {

    try {
        const Pool = pg.Pool;
        const pool = new Pool({
            user: 'postgres',
            password: '9848',
            host: 'localhost',
            database: 'fundManagerdb',
            port: 5432 // Default PostgreSQL port
        });
        pool.connect()
        const { categoryName } = req.body

        if (!categoryName) {
            return res.send({ message: 'category Name is Required' })
        }

        const deleteCategoryQuery = `
        DELETE FROM "category"
        WHERE category_name=${categoryName}
        `;
        const checkCategoryQuery = `
        SELECT * FROM "category" 
        WHERE category_name=${categoryName}
        ;
        `;
        //check for existing category
        const existingCategory = await pool.query(checkCategoryQuery)

        if (existingUser != null) {
            return res.status(200).send({
                success: false,
                message: 'Category Do not exist'
            })
        }
        else {
            const user = await pool.query(deleteCategoryQuery)
            //send the response
            return res.status(200).send({
                success: true,
                message: 'Category Deleted successfully'
            })
        }


    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: 'sorry error occured',
            error
        })
    }

}
export const createCategoryController = async (req, res) => {

    try {
        const Pool = pg.Pool;
        const pool = new Pool({
            user: 'postgres',
            password: '9848',
            host: 'localhost',
            database: 'fundManagerdb',
            port: 5432 // Default PostgreSQL port
        });
        pool.connect()
        const { name, email, password } = req.body
        if (!name) {
            return res.send({ message: 'Name is required' })
        }
        if (!email) {
            return res.send({ message: 'Email is required' })
        }
        if (!password) {
            return res.send({ message: 'password is required' })
        }

        const registerQuery = `
        INSERT INTO "user" (
            ${name},
            ${email},
            ${password},
        );
        `;
        const checkUserQuery = `
        SELECT * FROM "user" 
        WHERE user_email=${email}
        ;
        `;
        //check for existing user
        const existingUser = await pool.query(checkUserQuery)

        if (existingUser != null) {
            return res.status(200).send({
                success: false,
                message: 'Already a user Please Login'
            })
        }
        else {
            const user = await pool.query(registerQuery)
            //send the response
            res.status(200).send({
                success: true,
                message: 'User is Registerd successfully'
            })
        }//save the user


    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: 'sorry error occured',
            error
        })
    }

}

