import _ from 'lodash';
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { MODAL_SECTIONS } from '@constants/modals';
import { CATEGORY_COLORS } from '@constants/calendar';
import { selectCategories } from '@store/selectors/app';
import { setModal, setCategories } from '@store/actions/app';

export const setActiveColorStyle = (color = '') => ({
	background: color,
});

const CreateCategory = ({
	onClose = () => null,
}) => {
	const dispatch = useDispatch();

	const categories = useSelector(selectCategories);

	const [ hasError, setHasError ] = React.useState(false);
	const [ data, setData ] = React.useState({ name: '', color: '#2C52BA', checked: true });

	const onSubmit = (payload = []) => {
		const clonedCategories = [ ...categories ];

		clonedCategories.push({
			...payload,
			id: _.uniqueId('category_'), 
		});

		dispatch(setCategories(clonedCategories));

		dispatch(setModal(MODAL_SECTIONS.CLOSED));
	}

	const validate = (payload = {}) => {
		const errs = {};

		if (!payload?.name || !payload?.name.length) {
			errs.name = 'Category name is required';
		}

		return errs;
	}

	const handleChange = (e) => setData({
		...data, [e.target.name]: e.target.value
	});

	const handleColor = (color) => setData({
		...data, color,
	});

	const handleClearError = () => {
		setHasError(false);
	};

	const handleSubmit = () => {
		const errs = validate(data);

		setHasError(
			Boolean(
				Object.keys(errs || {}).length
			)
		);

		onSubmit(data);
	}

	return (
		<>
			<aside className="category__form" style={{ left: "211px", top: "314px" }}>
				<div className="category__form--body">
					{hasError ? (
						<div className="ctg-input--err" onClick={handleClearError}>
							Category name is required
						</div>
					) : null}
					<input
						placeholder="Create new category"
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
