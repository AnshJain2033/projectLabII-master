import pg from 'pg'
import pgPromise from 'pg-promise'
export const registerController = async (req, res) => {
    const pgp = pgPromise()
    try {
        const Pool = pg.Pool;
        const pool = new Pool({
            user: 'postgres',
            password: '9848',
            host: 'localhost',
            database: 'fundManagerdb',
            port: 5432 // Default PostgreSQL port
        });
        const client = await pool.connect()
        if (client) { console.log("Connection established") }
        const { user_name, user_email, user_password } = req.body
        if (!user_name) {
            return res.send({ message: 'Name is required' })
        }
        if (!user_email) {
            return res.send({ message: 'Email is required' })
        }
        if (!user_password) {
            return res.send({ message: 'password is required' })
        }
        const values = [user_name, user_email, user_password]

        const registerQuery = `
        INSERT INTO "user" 
        ("user_name","user_email","user_password")
        VALUES(
            $1,
            $2,
            $3
 
        )  RETURNING "user_id";
        `;
        const checkUserQuery = `
        SELECT * FROM "user" 
        WHERE user_email=$1
        ;
        `;

        //check for existing user
        const existingUser = await pool.query(checkUserQuery, [user_email])
        if (existingUser.rows.length == 0) { console.log("working") }
        if (existingUser.rows.length > 0) {
            res.status(200).send({
                success: false,
                message: 'Already a user Please Login'
            })
        }
        else {
            const user = await pool.query(registerQuery, values)
            //send the response
            const finalUserID = user.rows[0].user_id
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
export const loginController = async (req, res) => {

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
        const { user_email, user_password } = req.body

        if (!user_email) {
            return res.send({ message: 'Email is required' })
        }
        if (!user_password) {
            return res.send({ message: 'password is required' })
        }


        const checkUserQuery = `
        SELECT * FROM "user" 
        WHERE user_email=$1
        ;
        `;
        const correctUserQuery = `
        SELECT * FROM "user" 
        WHERE user_email=$1
        AND user_password=$2
        ;
        `;
        //check for existing user
        const existingUser = await pool.query(checkUserQuery, [user_email])

        if (existingUser.rows.length > 0) {
            const correctUser = await pool.query(correctUserQuery, [user_email, user_password])
            if (correctUser.rows.length > 0) {
                return res.status(200).send({
                    success: true,
                    message: 'Login Successfull'
                })
            }
            res.status(200).send({
                success: false,
                message: 'password Incorrect',
            })
        }
        else {
            return res.status(200).send({
                success: false,
                message: 'User Not Registered',

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
export const deleteUserController = async (req, res) => {

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
        const { user_email } = req.body
        if (!user_email) {
            return res.send({ message: 'Email is required' })
        }
        const deleteUserQuery = `
        DELETE FROM "user" 
        WHERE user_email=$1;
        `;
        const checkUserQuery = `
        SELECT * FROM "user" 
        WHERE user_email=$1
        ;
        `;
        //check for existing user
        const existingUser = await pool.query(checkUserQuery, [user_email])

        if (existingUser.rows.length > 0) {
            await pool.query(deleteUserQuery, [user_email])
            return res.status(200).send({
                success: true,
                message: 'User Deleted Successfully'
            })
        }
        else {
            return res.status(200).send({
                success: false,
                message: 'Enter a valid User Email'
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





