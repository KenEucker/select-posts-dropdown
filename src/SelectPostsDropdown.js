/* eslint-disable no-restricted-syntax */
/**
 * BLOCK: fb-diversity
 *
 * Registering a basic block with Gutenberg.
 * Simple block, renders and saves the same content without any interactivity.
 */

// import 'semantic-ui-css/semantic.min.css'
// TODO: REPLACE THIS WITH THE LINE ABOVE ONCE CGB-SCRUIPTS WEBPACK CONFIG IS EDITABLE
import React from 'react'
import { Dropdown } from 'semantic-ui-react'
import apiFetch from '@wordpress/api-fetch'

const styleLink = document.createElement('link')
styleLink.rel = 'stylesheet'
styleLink.href =
    'https://cdn.jsdelivr.net/npm/semantic-ui/dist/semantic.min.css'
document.head.append(styleLink)

export default class SelectPostsDropdown extends React.Component {
    static defaultProps = {
        restBase: '/wp-json/wp/v2',
        placeholder: 'Select Post',
        fields: ['id', 'title'],
        postType: 'posts',
        saveToWpData: true,
    }

    constructor(props) {
        super(props)
        this.state = {
            showing_modal: false,
            options: null,
            currentValue: props.selectedValue
        }
    }

    handleAddition(e, { value }) {
        this.setState(prevState => ({
            options: [{ text: value, value }, ...prevState.options]
        }));
    }

    handleChange(e, el) {
        if (typeof this.props.limit !== 'undefined') {
            if (el.value.length <= this.props.limit) {
                this.setState({ currentValue: el.value });
            } else {
                return
            }
        }

        let selected = null;

        if (this.props.multiple || Array.isArray(el.value)) {
            selected = el.options.filter(opt => { return el.value.indexOf(opt.value) !== -1 })
        } else {
            selected = el.options.filter(opt => { return opt.value == el.value })
        }

        if (!!selected && !!this.props.onChange) {
            // TODO: Use the code below to grab more data requested by the user
            // const includeFields = this.props.fields

            // // only return the data the user wants
            // const postData = Object.keys( selected )
            // 	.filter( k => includeFields.includes( k ) )
            // 	.map( k => Object.assign( {}, { [ k ]: selected[ k ] } ) )
            // 	.reduce( ( res, o ) => Object.assign( res, o ), {} )

            selected = selected.map((v) => {
                return { id: v.value, title: v.text }
            })

            if (this.props.multiple) {
                this.props.onChange(selected)
            } else if (selected && selected.length) {
                this.props.onChange(selected[0])
            }
        }
    }

    componentDidMount() {
        const savingToWpData = !!this.props.saveToWpData
        const wpDataField = typeof this.props.saveToWpData === 'string' ? this.props.saveToWpData : 'wpData'
        const additionalApiParams = this.props.per_page ? `per_page=${this.props.per_page}` : null;

        const decodeHtmlText = function (str) {
            return str.replace(/&#(\d+);/g, function (match, dec) {
                return String.fromCharCode(dec)
            })
        }

        const setOptsAndGlobalPostsFromPosts = (posts) => {
            if (savingToWpData) {
                window[wpDataField] = window[wpDataField] || {}
                window[wpDataField][this.props.postType] = posts
            }

            const options = []
            for (const post of posts) {
                options.push({ text: decodeHtmlText(post.title.rendered), value: post.id })
            }

            this.setState({ options, posts })
        }

        if (!!window[wpDataField]
            && !!window[wpDataField][this.props.postType]
            && window[wpDataField][this.props.postType].length) {
            setOptsAndGlobalPostsFromPosts(window[wpDataField][this.props.postType])
        } else {
            apiFetch({ path: `${this.props.restBase}/${this.props.postType}?${additionalApiParams}` })
                .then((posts) => {
                    setOptsAndGlobalPostsFromPosts(posts)
                })
        }
    }

    render() {
        const { className, heading, multiple, placeholder } = this.props
        const { options } = this.state
        const { currentValue } = this.state;

        return (
            <div className={className}>
                <span>{heading}</span>
                <Dropdown
                    placeholder={placeholder}
                    onAddItem={this.handleAddition.bind(this)}
                    onChange={this.handleChange.bind(this)}
                    fluid
                    search
                    selection
                    multiple={multiple}
                    options={options}
                    value={currentValue}
                />
            </div>
        )
    }
}
