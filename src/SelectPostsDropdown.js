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

const styleLink = document.createElement( 'link' )
styleLink.rel = 'stylesheet'
styleLink.href =
  'https://cdn.jsdelivr.net/npm/semantic-ui/dist/semantic.min.css'
document.head.append( styleLink )

export default class SelectPostsDropdown extends React.Component {
	static defaultProps = {
		restBase: '/wp-json/wp/v2',
		placeholder: 'Select Post',
		fields: [ 'id', 'title' ],
		postType: 'posts',
		saveToWpData: true,
	}

	constructor( props ) {
		super( props )
		this.state = {
			showing_modal: false,
			options: null,
		}
	}

	onDropdownSelect( e, el ) {
		const selected = el.options[ 0 ]

		if ( !! selected && !! this.props.onChange ) {
			// TODO: Use the code below to grab more data requested by the user
			// const includeFields = this.props.fields

			// // only return the data the user wants
			// const postData = Object.keys( selected )
			// 	.filter( k => includeFields.includes( k ) )
			// 	.map( k => Object.assign( {}, { [ k ]: selected[ k ] } ) )
			// 	.reduce( ( res, o ) => Object.assign( res, o ), {} )

			this.props.onChange( { id: selected.value, title: selected.text } )
		}
	}

	componentDidMount() {
		const savingToWpData = !! this.props.saveToWpData
		const wpDataField = typeof this.props.saveToWpData === 'string' ? this.props.saveToWpData : 'wpData'

		const decodeHtmlText = function( str ) {
			return str.replace( /&#(\d+);/g, function( match, dec ) {
				return String.fromCharCode( dec )
			} )
		}

		const setOptsAndGlobalPostsFromPosts = ( posts ) => {
			if ( savingToWpData ) {
				window[ wpDataField ] = window[ wpDataField ] || {}
				window[ wpDataField ][ this.props.postType ] = posts
			}

			const options = []
			for ( const post of posts ) {
				options.push( { text: decodeHtmlText( post.title.rendered ), value: post.id } )
			}

			this.setState( { options, posts } )
		}

		if ( !! window[ wpDataField ] && !! window[ wpDataField ][ this.props.postType ] ) {
			setOptsAndGlobalPostsFromPosts( window[ wpDataField ][ this.props.postType ] )
		}

		apiFetch( { path: `${ this.props.restBase }/${ this.props.postType }` } )
			.then( ( posts ) => {
				setOptsAndGlobalPostsFromPosts( posts )
			} )
	}

	render() {
		const { className, heading, multiple, placeholder } = this.props
		const { options } = this.state
		
		return (
			<div className={ className }>
				<span>{ heading }</span>
				<Dropdown
					placeholder={ placeholder }
					onChange={ this.onDropdownSelect.bind( this ) }
					fluid
					search
					selection
					multiple={ multiple }
					options={ options }
					defaultValue={ this.props.selectedValue }
				/>
			</div>
		)
	}
}
