import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { setModal } from '@store/actions/app';
import { MODAL_SECTIONS } from '@constants/modals';
import { selectCollapsed } from '@store/selectors/app';

const CreateCTA = () => {
	const dispatch = useDispatch();

	const { sidebar: isSidebarCollapsed } = useSelector(selectCollapsed);

	const onCreateClick = () => {
		dispatch(setModal(MODAL_SECTIONS.CREATE_EVENT));
	}

	if (isSidebarCollapsed) {
		return null;
	}

	return (
		<aside className="toggle-form">
			<span 
				role="button" 
				aria-label="open form" 
				onClick={onCreateClick}
				className="toggle-form-btn" 
			>
				<svg width={36} height={36} viewBox="0 0 36 36">
					<path fill="#34A853" d="M16 16v14h4V20z" />
					<path fill="#4285F4" d="M30 16H20l-4 4h14z" />
					<path fill="#FBBC05" d="M6 16v4h10l4-4z" />
					<path fill="#EA4335" d="M20 16V6h-4v14z" />
					<path fill="none" d="M0 0h36v36H0z" />
				</svg>
			</span>
		</aside>
	);
}

export default CreateCTA;
