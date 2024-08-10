const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');


const app = express();
app.use(cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));
app.use(bodyParser.json());
app.use(cookieParser())

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'demo'
})
app.get('/', (req, res) => {
    res.send('Hello World');
})
//login section start
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    console.log(username, password)
    const sql = "SELECT * FROM user WHERE username = ? AND password = ?";
    db.query(sql, [username, password], (err, result) => {
        if (err) {
            console.log(err);
            return res.sendStatus(500);
        }
        if (result.length > 0) {
            const name = result[0].username;
            const token = jwt.sign({ name }, 'mypermissiondemo', { expiresIn: '1d' });
            // res.cookie('token', token);
            res.json({ role: result[0].role, status: 200, token: token });
        } else {
            res.sendStatus(401);
        }
    });
});


const verifyUser = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.sendStatus(401);  // Return 401 status if no token
    } else {
        jwt.verify(token, 'mypermissiondemo', (err, decoded) => {
            if (err) {
                return res.sendStatus(401);  // Return 401 status if token is invalid
            } else {
                req.user = decoded;  // Attach the decoded token payload to the request object
                next();
            }
        });
    }
}


app.get('/verifyuser', verifyUser, (req, res) => {
    res.sendStatus(200);  // Send 200 status if the token is valid
});


app.get('/logoutuser', (req, res) => {
    res.clearCookie('token');
    res.sendStatus(200)
})
//student table start
//add student data code in server
app.post('/addStudents', (req, res) => {
    const { first_name, last_name, address, mobile_number } = req.body
    const sql = `INSERT INTO students(first_name,last_name,address,mobile_number,status) VALUES(?,?,?,?,?)`
    const values = [first_name, last_name, address, mobile_number, "active"];

    db.query(sql, values, (err, result) => {
        if (err) {
            res.send(err)
            console.log(err + "error in adding students data in server")
        } else {
            res.sendStatus(200)
        }
    })
})
//get student data code in server
app.get('/getstudents', (req, res) => {
    const sql = "SELECT * FROM students"
    db.query(sql, (err, result) => {
        if (err) {
            console.log(err)
            console.log(err + "error in getting data in server")
        } else {
            res.send(result)
        }
    })
})
//get deactivestudent data code in server
app.get('/getdeactivestudents', (req, res) => {
    const sql = "SELECT * FROM students where status = 'deactive'"
    db.query(sql, (err, result) => {
        if (err) {
            console.log(err)
            console.log(err + "error in getting data in server")
        } else {
            res.send(result)
        }
    })
})
//get students with id code in server
app.get('/getstudentwithid/:id', (req, res) => {
    const id = req.params.id
    const sql = "SELECT * FROM students where id = ?"
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.log(err)
            console.log(err + "error in getting data for edit in server")
        } else {
            res.send(result)
        }
    })
})
//delete data code start in server
app.delete('/deletestudent/:id', (req, res) => {
    const id = req.params.id
    const sql = "DELETE FROM students WHERE id = ?"
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.log(err)
            console.log(err + "error in deleting data in server")
        } else {
            res.send(result)
        }
    })
})
//update data code start in server
app.put('/updatestudent/:id', (req, res) => {
    const id = req.params.id
    const { first_name, last_name, address, mobile_number, status } = req.body
    const sql = `UPDATE students SET first_name = ?, last_name = ?, address = ?, mobile_number = ? ,status=? WHERE id = ?`
    const values = [first_name, last_name, address, mobile_number, status, id]
    db.query(sql, values, (err, result) => {
        if (err) {
            console.log(err)
            console.log(err + "error in updating data in server")
        } else {
            res.sendStatus(200);
        }
    })
})

//instructure table start
//add instructure data code in server
app.post('/addinstructure', (req, res) => {
    const { first_name, last_name, address, mobile_number, graduation } = req.body
    const sql = `INSERT INTO instructure(first_name,last_name,address,mobile_number,graduation,status) VALUES(?,?,?,?,?,?)`
    const values = [first_name, last_name, address, mobile_number, graduation, "active"];

    db.query(sql, values, (err, result) => {
        if (err) {
            res.send(err)
            console.log(err + "error in adding instructure data in server")
        } else {
            res.sendStatus(200)
        }
    })
})
//get instructure data code in server
app.get('/getinstructure', (req, res) => {
    const sql = "SELECT * FROM instructure"
    db.query(sql, (err, result) => {
        if (err) {
            console.log(err)
            console.log(err + "error in getting data in server")
        } else {
            res.send(result)
        }
    })
})
//get deactiveinstructure data code in server
app.get('/getdeactiveinstructure', (req, res) => {
    const sql = "SELECT * FROM instructure where status = 'deactive'"
    db.query(sql, (err, result) => {
        if (err) {
            console.log(err)
            console.log(err + "error in getting data in server")
        } else {
            res.send(result)
        }
    })
})
//get instructures with id code in server
app.get('/getinstructurewithid/:id', (req, res) => {
    const id = req.params.id
    const sql = "SELECT * FROM instructure where id = ?"
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.log(err)
            console.log(err + "error in getting data for edit in server")
        } else {
            res.send(result)
        }
    })
})
//delete data code start in server
app.delete('/deleteinstructure/:id', (req, res) => {
    const id = req.params.id
    const sql = "DELETE FROM instructure WHERE id = ?"
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.log(err)
            console.log(err + "error in deleting data in server")
        } else {
            res.send(result)
        }
    })
})
//update data code start in server
app.put('/updateinstructure/:id', (req, res) => {
    const id = req.params.id
    const { first_name, last_name, address, mobile_number, graduation, status } = req.body
    const sql = `UPDATE instructure SET first_name = ?, last_name = ?, address = ?, mobile_number = ?,graduation = ?,status=? WHERE id = ?`
    const values = [first_name, last_name, address, mobile_number, graduation, status, id]
    db.query(sql, values, (err, result) => {
        if (err) {
            console.log(err)
            console.log(err + "error in updating data in server")
        } else {
            res.sendStatus(200);
        }
    })
})



//role table start
//add role data code in server
app.post('/addrole', (req, res) => {
    const { name } = req.body;
    const isSystem = (name.toLowerCase() === 'student' || name.toLowerCase() === 'parent') ? 0 : 1;
    const superAdmin = (name.toLowerCase() === 'superadmin') ? 1 : 0;

    const sql = `INSERT INTO role(name, is_active, is_system, is_superAdmin) VALUES(?, ?, ?, ?)`;
    const values = [name, 0, isSystem, superAdmin];

    db.query(sql, values, (err, result) => {
        if (err) {
            res.send(err)
            console.log(err + "error in adding role data in server")
        } else {
            res.sendStatus(200)
        }
    })
})
//get student data code in server
app.get('/getrole', (req, res) => {
    const sql = "SELECT * FROM role"
    db.query(sql, (err, result) => {
        if (err) {
            console.log(err)
            console.log(err + "error in getting data in server")
        } else {
            res.send(result)
        }
    })
})
//get students with id code in server
app.get('/getrolewithid/:id', (req, res) => {
    const id = req.params.id
    const sql = "SELECT * FROM role where id = ?"
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.log(err)
            console.log(err + "error in getting data for edit in server")
        } else {
            res.send(result)
        }
    })
})
//delete data code start in server
app.delete('/deleterole/:id', (req, res) => {
    const id = req.params.id
    const sql = "DELETE FROM role WHERE id = ?"
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.log(err)
            console.log(err + "error in deleting data in server")
        } else {
            res.send(result)
        }
    })
})
//update data code start in server
app.put('/updaterole/:id', (req, res) => {
    const id = req.params.id
    const { name } = req.body;
    const isSystem = name == 'Student' || 'student' || 'Parent' || 'parent' ? 0 : 1;
    const superAdmin = name == 'superAdmin' || 'superadmin' ? 1 : 0;
    const sql = `UPDATE role SET name = ?, is_system = ?, is_superAdmin = ? WHERE id = ?`
    const values = [name, isSystem, superAdmin, id]
    db.query(sql, values, (err, result) => {
        if (err) {
            console.log(err)
            console.log(err + "error in updating data in server")
        } else {
            res.sendStatus(200);
        }
    })
})

//user table start
//add user data code in server
app.post('/adduser', (req, res) => {
    const { username, password, role } = req.body;

    const sql = `INSERT INTO user(username, password, role) VALUES(?, ?, ?)`;
    const values = [username, password, role];

    db.query(sql, values, (err, result) => {
        if (err) {
            res.send(err)
            console.log(err + "error in adding user data in server")
        } else {
            res.sendStatus(200)
        }
    })
})
//get user data code in server
app.get('/getuser', (req, res) => {
    const sql = "SELECT * FROM user"
    db.query(sql, (err, result) => {
        if (err) {
            console.log(err)
            console.log(err + "error in getting data in server")
        } else {
            res.send(result)
        }
    })
})
//get user with id code in server
app.get('/getuserwithid/:id', (req, res) => {
    const id = req.params.id
    const sql = "SELECT * FROM user where id = ?"
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.log(err)
            console.log(err + "error in getting data for edit in server")
        } else {
            res.send(result)
        }
    })
})
//delete data code start in server
app.delete('/deleteuser/:id', (req, res) => {
    const id = req.params.id
    const sql = "DELETE FROM user WHERE id = ?"
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.log(err)
            console.log(err + "error in deleting data in server")
        } else {
            res.send(result)
        }
    })
})
//update data code start in server
app.put('/updateuser/:id', (req, res) => {
    const id = req.params.id
    const { username, password, role } = req.body;
    const sql = `UPDATE user SET username = ?, password = ?, role = ? WHERE id = ?`
    const values = [username, password, role, id];
    db.query(sql, values, (err, result) => {
        if (err) {
            console.log(err)
            console.log(err + "error in updating data in server")
        } else {
            res.sendStatus(200);
        }
    })
})
//permission data section start
//get permission data from two tables 
app.get('/permissiondata', (req, res) => {
    const sql = "SELECT pc.*,pg.name as pgname FROM permission_category as pc inner join permission_group as pg on pg.id = pc.perm_group_id "
    db.query(sql, (err, result) => {
        if (err) {
            console.log(err)
            console.log(err + "error in getting data in server")
        } else {
            res.send(result)
        }
    })
})

//add permission data with permission group category and permission group
app.post('/add-role-permissions/:id', (req, res) => {
    const id = req.params.id;
    const permissionData = req.body;

    permissionData.forEach((permission) => {
        const { itemName, enable_view, enable_add, enable_edit, enable_delete } = permission;

        const pcidQuery = `SELECT id FROM permission_category WHERE name = ?`;

        db.query(pcidQuery, [itemName], (err, result) => {
            if (err) {
                console.log(err);
                return res.sendStatus(500);
            }

            if (result.length === 0) {
                console.log(`No permission category found for ${itemName}`);
                return res.sendStatus(400);
            }

            const percid = result[0].id;
            const sql = `INSERT INTO roles_permissions(role_id, perm_cat_id,can_view, can_add, can_edit, can_delete) VALUES(?, ?, ?, ?,?, ?)`;
            const values = [id, percid, enable_view, enable_add, enable_edit, enable_delete];

            db.query(sql, values, (err, result) => {
                if (err) {
                    console.log(err + " error in adding permission data in server");
                    return res.status(500).send(err);
                } else {
                    console.log(`Permission for ${itemName} added successfully.`);
                }
            });
        });
    });

    res.sendStatus(200);
});

app.get("/rolepermissiondataforcheck/:id", (req, res) => {
    const id = req.params.id
    const sql = "SELECT * FROM roles_permissions WHERE role_id = ?"
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.log(err)
            console.log(err + "error in getting data for edit in server")
        } else {
            res.send(result)
        }
    })
})

//update role permission data
app.put('/update-role-permissions/:id', (req, res) => {
    const id = req.params.id;
    const roleId = parseInt(id);
    const permissionData = req.body;
    permissionData.forEach((permission) => {
        const { enable_view, enable_add, enable_edit, enable_delete, permid } = permission;
        console.log(permission)
        const sql = `UPDATE roles_permissions SET can_view = ?, can_add = ?, can_edit = ?, can_delete = ? WHERE role_id = ? AND perm_cat_id = ?`;
        const values = [enable_view, enable_add, enable_edit, enable_delete, roleId, permid];
        console.log(values)

        db.query(sql, values, (err, result) => {
            if (err) {
                console.log(err + " error in updating permission data in server");
                return res.status(500).send(err);
            } else {
                console.log(`Permission for updated successfully.`);
            }
        });
    });

    res.sendStatus(200);
});

//for user authentication get role permission data
app.get("/getPermRole", (req, res) => {
    const userRole = req.query.userRole;
    if (!userRole) {
        return res.status(400).send("User role is required");
    }

    const sql = "SELECT id FROM role WHERE name = ?";

    db.query(sql, [userRole], (err, result) => {
        if (err) {
            console.log("Error in first query:", err);
            return res.status(500).send("Error in getting data from server");
        }

        if (result.length === 0) {
            return res.status(404).send("Role not found");
        }

        const rolId = result[0].id;

        const sql2 = 'SELECT * FROM roles_permissions WHERE role_id = ?';

        db.query(sql2, [rolId], (err, result) => {
            if (err) {
                console.log("Error in second query:", err);
                return res.status(500).send("Error in getting data from server");
            } else {
                res.send(result);
            }
        });
    });
});


app.listen(1007, () => {
    console.log('Server is running on port 1007')
})