module.exports = {
    rules: {
        "no-unused-vars": [
            "error",
            {
                vars: "all",
                args: "after-used",
                ignoreRestSiblings: false,
                argsIgnorePattern: "^_",
                varsIgnorePattern: "^_",
            },
        ],
    },
};
