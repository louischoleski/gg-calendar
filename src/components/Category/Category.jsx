import React from 'react';

const Category = () => {
	return (
		<aside className="category__form hide-ctg-form">
			<div className="category__form--body">
				<div className="ctg-input--err hide-ctg-err" />
				<input
					type="text"
					className="category__form-input"
					placeholder="Category Name"
					maxLength={20}
					minLength={1}
					required
				/>
				<div className="color__picker">
					<div className="color-picker__header">
						<div className="color-picker__title">color</div>
					</div>
					<div className="color-picker__options" />
				</div>
			</div>
			<div className="category__form--footer">
				<button
					className="btn-root category__form--cancel"
					role="button"
					aria-label="button"
				>
					Cancel
				</button>
				<button
					className="btn-root category__form--submit"
					role="button"
					aria-label="button"
				>
					Save
				</button>
			</div>
		</aside>
	);
}

export default Category;
