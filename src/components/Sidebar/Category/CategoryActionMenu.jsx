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

	const onEditClick = () => {

	}

	const onDisplayOnClick = () => {

	}

	const onDisplayAllClick = () => {

	}

	return (
		<>
			<div className="popup-ctg-options" style={{ top: "367px", left: "222px" }}>
				<div className="option__open-ctg-edit">
					Edit category (name, color)
				</div>
				<div className="option__close-other-ctg">
					Display this only
				</div>
				<div className="option__open-other-ctg">
					Display all but this
				</div>
			</div>
			<div className="popup-ctg-options__overlay" />
		</>
	);
}

export default Category;
