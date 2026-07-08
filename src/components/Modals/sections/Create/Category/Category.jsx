import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import uniqueId from '@utils/uinqueId';
import { MODAL_SECTIONS } from '@constants/modals';
import { CATEGORY_COLORS } from '@constants/calendar';
import { renameEntriesCategory } from '@store/actions/entries';
import { selectCategories, selectModalData } from '@store/selectors/app';
import { setModal, setCategories, updateCategories } from '@store/actions/app';

export const setActiveColorStyle = (color = '') => ({
	background: color,
});

const CreateCategory = ({
	onClose = () => null,
}) => {
	const dispatch = useDispatch();

	const modalData = useSelector(selectModalData);
	const categories = useSelector(selectCategories);

	// Edit mode when the modal payload carries a category id.
	const editCategory = React.useMemo(() => (
		modalData?.id ?
			categories.find(({ id }) => id === modalData.id) :
			null
	), []);

	const [ error, setError ] = React.useState(null);
	const [ data, setData ] = React.useState({
		checked: true,
		name: editCategory?.name || '',
		color: editCategory?.color || '#2C52BA',
	});

	const onSubmit = (payload = {}) => {
		if (editCategory) {
			const index = categories.findIndex(({ id }) => id === editCategory.id);

			dispatch(updateCategories(index, {
				...editCategory,
				name: payload.name,
				color: payload.color,
			}));

			// Entries reference categories by name; follow the rename.
			if (payload.name !== editCategory.name) {
				dispatch(renameEntriesCategory(editCategory.name, payload.name));
			}
		} else {
			dispatch(setCategories([
				...categories,
				{ ...payload, id: `category_${uniqueId().toLowerCase()}` },
			]));
		}

		dispatch(setModal(MODAL_SECTIONS.CLOSED));
	}

	const validate = (payload = {}) => {
		const name = (payload?.name || '').trim();

		if (!name.length) {
			return 'Category name is required';
		}

		const clash = categories.find((category) => (
			category.name === name && category.id !== editCategory?.id
		));

		if (clash) {
			return 'Category already exists';
		}

		return null;
	}

	const handleChange = (e) => {
		setError(null);
		setData({ ...data, [e.target.name]: e.target.value });
	};

	const handleColor = (color) => setData({
		...data, color,
	});

	const handleClearError = () => {
		setError(null);
	};

	const handleSubmit = () => {
		const err = validate(data);

		if (err) {
			setError(err);
			return;
		}

		onSubmit({ ...data, name: data.name.trim() });
	}

	return (
		<>
			<aside className="category__form" style={{ left: "211px", top: "314px" }}>
				<div className="category__form--body">
					{error ? (
						<div className="ctg-input--err" onClick={handleClearError}>
							{error}
						</div>
					) : null}
					<input
						placeholder={editCategory ? 'Edit category' : 'Create new category'}
						className="category__form-input"
						onChange={handleChange}
						value={data?.name}
						maxLength={20}
						minLength={1}
						type="text"
						name="name"
						required
					/>
					<div className="color__picker">
						<div className="color-picker__header">
							<div
								className="color-picker__title"
								style={setActiveColorStyle(data?.color)}
							>
								color
							</div>
						</div>
						<div className="color-picker__options">
							{CATEGORY_COLORS.map((hexColor) => (
								<div
									key={hexColor}
									data-color-hex={hexColor}
									className="color-picker--option"
									style={{ backgroundColor: hexColor }}
									onClick={() => handleColor(hexColor)}
								>
									{(hexColor === data?.color) ? (
										<svg
											width="18px"
											height="18px"
											viewBox="0 0 24 24"
											fill="var(--taskcolor"
										>
											<path d="M0 0h24v24H0z" fill="none" />
											<path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" />
										</svg>
									) : null}
								</div>
							))}
						</div>
					</div>
				</div>
				<div className="category__form--footer">
					<button
						className="btn-root category__form--cancel"
						aria-label="button"
						onClick={onClose}
						role="button"
					>
						Cancel
					</button>
					{" "}
					<button
						className="btn-root category__form--submit"
						onClick={handleSubmit}
						aria-label="button"
						role="button"
					>
						Save
					</button>
				</div>
			</aside>
			<aside 
				className="category__form-overlay"
				onClick={onClose}
			/>
		</>
	);
}

export default CreateCategory;
