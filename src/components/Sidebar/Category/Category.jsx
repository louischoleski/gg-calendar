import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { MODAL_SECTIONS } from '@constants/modals';
import { selectCollapsed, selectCategories } from '@store/selectors/app';
import { setModal, toggleCollapsed, setCategories, updateCategories } from '@store/actions/app';

import CategoryOption from './CategoryOption';
import { setCategoryCaret } from './Category.controller';

const Category = () => {
	const dispatch = useDispatch();

	const categories = useSelector(selectCategories);
	const { category: isCategoryCollapsed } = useSelector(selectCollapsed);

	const toggleShowCategory = () => {
		dispatch(toggleCollapsed.category());
	}

	const toggleCreateCategory = () => {
		dispatch(setModal(MODAL_SECTIONS.CREATE_CATEGORY));
	}

	const onCategoryClick = (categoryId) => {
		const clonedCategories = [ ...categories ];

		const activeIndex = clonedCategories.findIndex(({ id }) => (
			id === categoryId
		));

		const activeCategory = { ...clonedCategories[activeIndex] };

		activeCategory.checked = !activeCategory.checked;

		dispatch(updateCategories(activeIndex, activeCategory));
	}

	return (
		<div className="sb__categories">
			<div
				className="sb__categories--header"
				style={{ backgroundColor: "var(--black1)" }}
			>
				<div className="sbch-col__one" onClick={toggleShowCategory}>
					<div className="sbch-title">
						Techs
					</div>
					{/*
					<div className={setCategoryCaret(isCategoryCollapsed)}>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="var(--white2)"
							height={24}
							width={24}
						>
							<path d="m12 15.375-6-6 1.4-1.4 4.6 4.6 4.6-4.6 1.4 1.4Z" />
						</svg>
					</div>
					*/}
				</div>
				{/*
				<div className="sbch-plus" onClick={toggleCreateCategory}>
					<svg
						xmlns="http://www.w3.sorg/2000/svg"
						style={{ pointerEvents: "none" }}
						fill="var(--white2)"
						height={24}
						width={24}
					>
						<path d="M11 19v-6H5v-2h6V5h2v6h6v2h-6v6Z" />
					</svg>
				</div>
				*/}
			</div>
			<div className="sb__categories--body">
				<div className="sb__categories--body-form">
					{!isCategoryCollapsed ? (
						categories.map(({ id, ...rest }, categoryIdx) => (
							<CategoryOption 
								onDeleteClick={onCategoryClick}
								showDelete={categoryIdx != 0}
								onClick={onCategoryClick}
								key={id} id={id}
								{...rest }
							/>
						))
					) : null}
				</div>
			</div>
		</div>
	);
}

export default Category;
