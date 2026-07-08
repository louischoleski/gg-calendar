import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { setModal } from '@store/actions/app';
import { selectModal } from '@store/selectors/app';
import { MODAL_SECTIONS } from '@constants/modals';

import Create from './sections/Create';
import Search from './sections/Search';
import Settings from './sections/Settings';
import Shortcuts from './sections/Shortcuts';

const Modal = () => {
	const dispatch = useDispatch();

	const modalSection = useSelector(selectModal);

	const modalRef = React.useRef(null);

	const onClose = () => {
		dispatch(setModal(MODAL_SECTIONS.CLOSED));
	}

	React.useEffect(() => {
		const handleKeyUp = (e) => {
			const keys = {
				27: () => {
					e.preventDefault();
					onClose();
					window.removeEventListener('keyup', handleKeyUp, false);
				},
			};

			if (keys[e.keyCode]) {
				keys[e.keyCode]();
			}
		};

		const handleOutsideClick = (e) => {
			e.stopPropagation();
			if (modalRef.current && !modalRef.current.contains(e.target)) {
				onClose();
				document.removeEventListener('mousedown', handleOutsideClick, false);
			}
		};

		document.body.classList.add('modal-open');
		window.addEventListener('keyup', handleKeyUp, false);
		document.addEventListener('mousedown', handleOutsideClick, false);

		return () => {
			document.body.classList.remove('modal-open');
			window.removeEventListener('keyup', handleKeyUp, false);
			document.removeEventListener('mousedown', handleOutsideClick, false);
		};
	}, [ onClose ]);

	if (modalSection === MODAL_SECTIONS.CLOSED) {
		return null;
	}

	if (modalSection === MODAL_SECTIONS.SEARCH) {
		return (
			<Search 
				onClose={onClose}
			/>
		);
	}

	if (modalSection === MODAL_SECTIONS.SETTINGS) {
		return (
			<Settings
				onClose={onClose}
			/>
		);
	}

	if (modalSection === MODAL_SECTIONS.SHORTCUTS) {
		return (
			<Shortcuts
				onClose={onClose}
			/>
		);
	}

	if (modalSection === MODAL_SECTIONS.CREATE_EVENT) {
		return (
			<Create.Event
				onClose={onClose}
			/>
		);
	}

	if (modalSection === MODAL_SECTIONS.CREATE_CATEGORY) {
		return (
			<Create.Category
				onClose={onClose}
			/>
		);
	}

	// return (
	// 	<>
	// 		<div key={`modal-${id}`} tabIndex={-1} role="dialog" className="modal fade show d-block">
	// 			<div role="document" ref={modalRef} className={`modal-dialog modal-${size} ${centered ? 'modal-dialog-centered' : ''}`}>
	// 				<div className="modal-content">
	// 					<div className="modal-header">
	// 						{title && title.length && <h5 className="modal-title">{title}</h5>}
	// 						<button type="button" aria-label="Close" className="btn-close" data-bs-dismiss="modal" onClick={onClose} />
	// 					</div>
	// 					<div className="modal-body">
	// 						{children}
	// 					</div>
	// 					{withFooter && (
	// 						<div className="modal-footer">
	// 							<button type="button" className="btn btn-white" data-bs-dismiss="modal" onClick={onClose}>
	// 								Close
	// 							</button>
	// 							<button type="button" className="btn btn-primary" onClick={onSaveRequest}>
	// 								Save changes
	// 							</button>
	// 						</div>
	// 					)}
	// 				</div>
	// 			</div>
	// 		</div>
	// 		<div key={`modal-backdrop-${id}`} className="modal-backdrop fade show" />
	// 	</>
	// );
};

export default Modal;
