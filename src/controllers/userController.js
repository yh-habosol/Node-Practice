import User from "../models/User";
import bcrypt from "bcrypt";


export const getJoin = (req, res) => {
    return res.render("join", {pageTitle: "Join"});
}


export const postJoin =  async (req, res) => {
    const {name, username, email, password, password2} = req.body;
    
    const isUsernameExist = await User.exists({
        username,
    });

    if(isUsernameExist){
        return res.status(400).render("join", {pageTitle: "join", errorMessage:"already have username"});
    }

    const isEmailExist = await User.exists({
        email,
    });

    if(isEmailExist){
        return res.status(400).render("join", {pageTitle: "join", errorMessage:"already have email"});
    }

    if(password !== password2){
        return res.status(400).render("join", {pageTitle: "join", errorMessage:"password not consist!"});
    }

    await User.create({
        name,
        username,
        email,
        password,
    })

    return res.redirect("/login");
}

export const getLogin = (req, res) => {
    return res.render("login", {pageTitle: "login"});
}


export const postLogin = async (req, res) => {
    const {username, password} = req.body;

    const user = await User.findOne({
        username,
        socialOnly: false,
    });


    if(!user){
        return res.status(400).render("login", {pageTitle: "login", errorMessage: "username not exists"});
    }

    const ok = await bcrypt.compare(password, user.password);
    if(!ok){
        return res.status(400).render("login", {pageTitle: "login", errorMessage: "password not correct"});
    }

    req.session.loggedIn = true;
    req.session.user = user;

    return res.redirect("/");
}

export const githubStart = (req, res) => {
    const baseUrl = "https://github.com/login/oauth/authorize";

    const config = {
        client_id: process.env.GH_CLIENT,
        allow_signup: false,
        scope: "read:user user:email",
        
    };

    const params = new URLSearchParams(config).toString();
    const newUrl = `${baseUrl}?${params}`;

    return res.redirect(newUrl);
}


export const githubFinish = async (req, res) => {
    const baseUrl = "https://github.com/login/oauth/access_token";

    const config = {
        client_id: process.env.GH_CLIENT,
        client_secret: process.env.GH_SECRET,
        code: req.query.code,
    };

    const params = new URLSearchParams(config).toString();
    const newUrl = `${baseUrl}?${params}`;


    const response = await fetch(newUrl, {
        method: "POST",
        headers: {
            Accept: "application/json",
        }
    });
    
    const tokenRequest = await response.json();



    if ("access_token" in tokenRequest) {
        const {access_token} = tokenRequest;
        const apiUrl = "https://api.github.com";

        const userData = await (
            await fetch(`${apiUrl}/user`, {
                headers: {
                    Authorization: `token ${access_token}`,
                }
            })
        ).json();

        const emailData = await (
            await fetch(`${apiUrl}/user/emails`, {
                headers: {
                    Authorization: `token ${access_token}`,
                }
            })
        ).json();

        const emailObj = emailData.find(
            (email) => email.primary === true && email.verified===true
        );

        if(!emailObj){
            return res.redirect("/login");
        }

        let user = await User.findOne({
            email: emailObj.email
        });
        if(!user){
            user = await User.create({
                name: userData.name? userData.name : "unknown",
                username: userData.login,
                email: emailObj.email,
                password: "",
                socialOnly: true,
            })
        }

        req.session.user = user;
        req.session.loggedIn = true;
        return res.redirect("/");

    }
    else{
        return res.redirect("/login");
    }

}





export const logout = (req, res) => {
    req.session.destroy();
    return res.redirect("/");
}


export const getEdit = (req, res) => {
    return res.render("editUser", {pageTitle: "Edit Profile"});
}

export const postEdit = async (req ,res) => {
     const {
        session: {
            user: {
                _id, avatarUrl
            }
        },
        body: {
            name, username, email,
        }
     } = req;

     const file = req.file;
    
     const user = await User.findById(_id);

     if(user.username === username){
        return res.status(400).render("editUser", {pageTitle: "edit Profile", errorMessage: "already exist username"});
     }

     if(user.email === email){
        return res.status(400).render("editUser", {pageTitle: "edit Profile", errorMessage: "already exist email"});
     }

     const updatedUser = await User.findByIdAndUpdate(_id, {
        name,
        username,
        email,
        avatarUrl: file? file.location : avatarUrl,
     },
     {new: true},
     );

    req.session.user = updatedUser;
    return res.redirect("/");
}

export const getChangePassword = (req, res) => {
    return res.render("changePassword", {pageTitle:"Change Password"});
}

export const postChangePassword = async (req, res) => {
    const {
        session:{
            user:{_id, password}
        },
        body: {
            currentPassword,
            newPassword,
            confirmPassword,
        }
    } = req;

    const ok = await bcrypt.compare(currentPassword,password);

    if(!ok){
        return res.status(400).render("changePassword", {pageTitle: "Change Password", errorMessage: "not current password!"});
    }

    if(newPassword !== confirmPassword){
        return res.status(400).render("changePassword", {pageTitle: "Change Password", errorMessage: "password not consistent"});
    }

    const user = await User.findById(_id);
    user.password = newPassword;
    await user.save();
    req.session.user.password = user.password;
    return res.redirect("/users/logout");
}



export const watchProfile = async (req, res) => {
    const {id} = req.params;

    const user = await User.findById(id).populate("videos");
    console.log(user);

    return res.render("watchProfile", {pageTitle: "user profile", user});
}