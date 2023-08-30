import pg from 'pg'
export const registerController = async (req, res) => {

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
        const values = [name, email, password]

        const registerQuery = `
        INSERT INTO "user" VALUES(
            $1,
            $2,
            $3
 
        );
        `;
        const checkUserQuery = `
        SELECT * FROM "user" 
        WHERE user_email=$1
        ;
        `;

        //check for existing user
        const existingUser = await pool.query(checkUserQuery, [email])

        if (existingUser != null) {
            return res.status(200).send({
                success: false,
                message: 'Already a user Please Login'
            })
        }
        else {
            const user = await pool.query(registerQuery, values)
            //send the response
            return res.status(200).send({
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
        const { email, password } = req.body

        if (!email) {
            return res.send({ message: 'Email is required' })
        }
        if (!password) {
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
        const existingUser = await pool.query(checkUserQuery, [email])

        if (existingUser != null) {
            const correctUser = await pool.query(correctUserQuery, [email, password])
            if (correctUser != null) {
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
        const { email } = req.body
        if (!email) {
            return res.send({ message: 'Email is required' })
        }
        const deleteUserQuery = `
        DELETE FROM "user" 
        WHERE user_email=${email};
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
                success: true,
                message: 'User deleted Successfully'
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





