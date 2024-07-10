module.exports = func => {
    return (req,res,next) => {
            func(req,res,next).catch(next);

    }
}

// The weird pattern to catch errors in express and handling 
// the async functions      