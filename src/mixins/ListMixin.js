export default {
    props: {
        header: {
            type: String,
            required: false,
            default: null
        },
        subheader: {
            type: String,
            required: false,
            default: null
        },
        headerLink: {
            type: String,
            required: false,
            default: null
        },
        isInteractive: {
            type: Boolean,
            required: false,
            default: false
        },
        compact: {
            type: Boolean,
            required: false,
            default: false
        }
    }
}
