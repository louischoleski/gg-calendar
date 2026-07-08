import React from 'react';

import {
	setCategoryOptionFill, 
	setCategoryOptionChecked,
	setCategoryOptionBtnStyle, 
} from './Category.controller';

const CategoryOption = ({
	id = '', 
	name = '', 
	color = '', 
	checked = false, 
	showDelete = false,
	onClick = () => null, 
	onDeleteClick = () => null,
}) => {
	const handleClick = (e) => {
		// onClick(id);
	}

	const handleDeleteClick = (e) => {
		// onDeleteClick(id);
	}

	return (
		<div className="sbch-form--item">
			<div className="sbch-form--item__col" onClick={handleClick}>
				<div className="sbch-form--item__checkbox--wrapper">
					<button
						data-sbch-category={name}
						className="sbch-form--item__checkbox"
						style={setCategoryOptionBtnStyle(color, checked)}
						data-sbch-checked={setCategoryOptionChecked(checked)}
					>
						<svg
							width="18px"
							height="18px"
							viewBox="0 0 24 24"
							fill={setCategoryOptionFill(checked)}
						>
							<path d="M0 0h24v24H0z" fill="none" />
							<path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" />
						</svg>
					</button>
				</div>
				<span className="sbch-form--item__label">
					{name}
				</span>
			</div>
			<div className="sbch-form--item__col--actions">
				{showDelete ? (
					<button
						data-sbch-color={color}
						data-sbch-category={name}
						onClick={handleDeleteClick}
						className="sbch-col--actions__delete-icon"
					>
						<svg height={20} width={20} fill="var(--white2)">
							<path d="M6.062 15 5 13.938 8.938 10 5 6.062 6.062 5 10 8.938 13.938 5 15 6.062 11.062 10 15 13.938 13.938 15 10 11.062Z" />
						</svg>
					</button>
				) : null}
				<button
					data-sbch-color={color}
					data-sbch-category={name}
					className="sbch-col--actions__edit-icon sbch-col--actions__edit-icon--immutable"
				>
					<svg height={20} width={20} fill="var(--white3)">
						<path d="M10 16q-.625 0-1.062-.438Q8.5 15.125 8.5 14.5t.438-1.062Q9.375 13 10 13t1.062.438q.438.437.438 1.062t-.438 1.062Q10.625 16 10 16Zm0-4.5q-.625 0-1.062-.438Q8.5 10.625 8.5 10t.438-1.062Q9.375 8.5 10 8.5t1.062.438q.438.437.438 1.062t-.438 1.062q-.437.438-1.062.438ZM10 7q-.625 0-1.062-.438Q8.5 6.125 8.5 5.5t.438-1.062Q9.375 4 10 4t1.062.438q.438.437.438 1.062t-.438 1.062Q10.625 7 10 7Z" />
					</svg>
				</button>
			</div>
		</div>
	);
}

export default CategoryOption;
