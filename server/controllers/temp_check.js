
const updateUser = async (req, res) => {
    const user = await User.findById(req.user.id);

    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email; // email is usually unchangeable or requires verify, but ok for now
        user.headline = req.body.headline || user.headline;
        user.about = req.body.about || user.about;
        user.skills = req.body.skills || user.skills;

        if (req.body.password) {
            user.password = req.body.password; // automatic hash in pre-save
        }

// ... file logic ...
// ... rest ...
