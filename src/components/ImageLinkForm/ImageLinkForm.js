import React from 'react';
import './ImageLinkForm.css'
const ImageLinkForm = ({onInputChange, onButtonSubmit}) => {
	return (
		<div>
			<p className='f3 tc'> 
				{'This Magic Brain will detect the faces in your pictures.'}
			</p>
			<div className='center'>
				<div className='center pa4 br3 shadow-5 form'>
					<input className="f4 pa2 w-60 center" type='tex' onChange={onInputChange}  />
					<button className="w-30 grow f4 link ph3 pv dib white bg-light-purple tc"
							onClick={onButtonSubmit}> Detect 
					</button>
				</div>
			</div>
		</div>
	);
}

export default ImageLinkForm