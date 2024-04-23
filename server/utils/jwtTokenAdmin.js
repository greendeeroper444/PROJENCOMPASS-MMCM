const sendTokenAdmin = (admin, statusCode, res, options) => {
    const token = admin.getJwtToken();

    //default options for cookies
    const defaultOptions = {
        expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        httpOnly: true,
        sameSite: "none",
        secure: true,
    };

    //Merge options with default options
    const cookieOptions = { ...defaultOptions, ...options };

    res.status(statusCode).cookie("token", token, cookieOptions).json({
        success: true,
        admin,
        token,
        message: options.message
    });
};

module.exports = sendTokenAdmin;
