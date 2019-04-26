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
import styled from 'styled-components'

const styleLink = document.createElement( 'link' )
styleLink.rel = 'stylesheet'
styleLink.href =
  'https://cdn.jsdelivr.net/npm/semantic-ui/dist/semantic.min.css'
document.head.append( styleLink )

const Container = styled.div`
    input.search {
        left: auto !important;
    }
`

export default class SelectPostsDropdown extends React.Component {
	constructor( props ) {
		super( props )
		this.state = {
			showing_modal: false,
			options: null,
		}
		this.props.restBase = props.restBase || '/wp-json/wp/v2'
		this.props.placeholder = props.placeholder || 'Select Post'
		this.props.icon = props.icon || 'world'
		this.props.fields = props.fields || [ 'id', 'title' ]
		this.props.postType = props.postType || 'posts'
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
		apiFetch( { path: `${ this.props.restBase }/${ this.props.postType }` } )
			.then( ( posts ) => {
				const options = []
				for ( const post of posts ) {
					options.push( { text: post.title.rendered, value: post.id } )
				}

				this.setState( { options, posts } )
			} )
	}

	render() {
		const { className, heading, placeholder, icon } = this.props
		const { options } = this.state

		return (
			<Container className={ className }>
				<span>{ heading }</span>
				<Dropdown
					button
					fluid
					search
					selection
					floating
					labeled
					className="icon"
					icon={ icon }
					placeholder={ placeholder }
					onChange={ this.onDropdownSelect.bind( this ) }
					options={ options }
				/>
			</Container>
		)
	}
}
