/*
 * SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
 *
 * Copyright (c) 2012-2026 mgm technology partners GmbH
 *
 * Dual License
 * ------------
 * This source file is part of the mgm A12 Platform and available under
 * a choice of two different licenses:
 *
 * 1. Open-Source License - EUPL v1.2
 *    You may redistribute and/or modify this file under the terms of the
 *    European Union Public License, version 1.2 - see https://eupl.eu/.
 *
 * 2. Commercial License
 *    Alternatively, you may obtain a commercial license from
 *    mgm technology partners GmbH, that permits use of this software
 *    under different terms (including support and maintenance services).
 *
 *    Please contact a12-license@mgm-tp.com for more information.
 *
 * You must select and comply with exactly one of the above license options.
 *
 * Warranty Disclaimer (applies to either option)
 * ----------------------------------------------
 * THIS SOFTWARE IS PROVIDED "AS IS" AND WITHOUT WARRANTY OF ANY KIND,
 * WHETHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NON-INFRINGEMENT, EXCEPT WHERE SUCH DISCLAIMERS ARE HELD TO BE
 * LEGALLY INVALID. SEE THE RESPECTIVE LICENSE TEXT FOR DETAILS.
 */
package com.mgmtp.a12.formengine.model.visitor;

import com.mgmtp.a12.formengine.model.FormModel;
import com.mgmtp.a12.formengine.model.types.*;

import java.util.ArrayList;
import java.util.List;

public class ModelWalker {

	protected ModelVisitor visitor;

	public ModelWalker(final ModelVisitor visitor) {
		this.visitor = visitor;
	}

	public void acceptModel(final FormModel model) {
		acceptContent(model.getContent());
	}

	public void acceptContent(final FormModelContent content) {
		if (!visitor.visitContent(content)) {
			return;
		}

		acceptHeaderFooter(content.getSubHeaderBox());
		if (visitor.hasStopped()) {
			return;
		}

		acceptHeaderFooter(content.getFooterBox());
		if (visitor.hasStopped()) {
			return;
		}

		acceptScreenGroupRootElement(content.getScreens());
		if (visitor.hasStopped()) {
			return;
		}

		if (content.getFieldConfiguration().getField() != null) {
			content.getFieldConfiguration().getField().forEach((FieldConfigurationEntryType fce) -> {
				acceptFieldConfigurationEntry(fce);
				if (visitor.hasStopped()) {
					return;
				}
			});
		}
	}

	public void acceptScreenGroupRootElement(final List<ScreenType> screens) {
		for (final ScreenType element : screens) {
			acceptScreen(element);
			if (visitor.hasStopped()) {
				return;
			}
		}
	}

	public void acceptScreen(final ScreenType screen) {
		visitor.enter(screen);
		if (!visitor.visitScreen(screen)) {
			return;
		}
		if (visitor.hasStopped()) {
			return;
		}

		acceptHeaderFooter(screen.getSubHeaderBox());
		if (visitor.hasStopped()) {
			return;
		}

		acceptHeaderFooter(screen.getFooterBox());
		if (visitor.hasStopped()) {
			return;
		}

		if (screen.getScreenElements() != null) {
			walkSEList(screen, screen.getScreenElements());
		}

		visitor.leave(screen);
	}

	public void acceptHeaderFooter(final HeaderFooterType headerFooter) {

		if (headerFooter == null) {
			return;
		}

		visitor.enter(headerFooter);
		if (!visitor.visitHeaderFooter(headerFooter)) {
			return;
		}
		if (visitor.hasStopped()) {
			return;
		}

		final List<ButtonType> buttons = new ArrayList<>();
		if (headerFooter.getMajorButtons() != null) {
			buttons.addAll(headerFooter.getMajorButtons().getButton());
		}
		if (headerFooter.getMinorButtons() != null) {
			buttons.addAll(headerFooter.getMinorButtons().getButton());
		}

		for (final ButtonType button : buttons) {
			acceptButton(button);
			if (visitor.hasStopped()) {
				return;
			}
		}

		visitor.leave(headerFooter);

	}

	public boolean acceptSection(final SectionType section) {
		visitor.enter(section);
		if (!visitor.visitSection(section)) {
			return false;
		}
		if (visitor.hasStopped()) {
			return true;
		}

		walkSEList(section, section.getScreenElement());

		visitor.leave(section);
		return true;
	}

	public boolean acceptCustomScreenElement(final CustomScreenElementType customScreenElement) {
		visitor.enter(customScreenElement);
		if (!visitor.visitCustomScreenElement(customScreenElement)) {
			return false;
		}
		if (visitor.hasStopped()) {
			return true;
		}

		visitor.leave(customScreenElement);
		return true;
	}

	public boolean acceptControlGrid(final ControlGridType grid) {
		visitor.enter(grid);
		if (!visitor.visitControlGrid(grid)) {
			return false;
		}
		if (visitor.hasStopped()) {
			return true;
		}

		for (final RowType row : grid.getRow()) {
			acceptRow(row);
			if (visitor.hasStopped()) {
				return true;
			}
		}

		visitor.leave(grid);
		return true;
	}

	public void acceptRow(final RowType row) {
		visitor.enter(row);
		if (!visitor.visitRow(row)) {
			return;
		}
		if (visitor.hasStopped()) {
			return;
		}

		for (final CellType cell : row.getCell()) {
			acceptCell(cell);
			if (visitor.hasStopped()) {
				return;
			}
		}

		visitor.leave(row);
	}

	public void acceptCell(final CellType cell) {
		if (cell instanceof ControlType) {
			acceptControl((ControlType) cell);
		} else if (cell instanceof TextCellType) {
			acceptTextCell((TextCellType) cell);
		} else if (cell instanceof ExpressionCellType) {
			acceptExpressionCell((ExpressionCellType) cell);
		} else if (cell instanceof CustomCellType) {
			acceptCustomCell((CustomCellType) cell);
		}
	}

	public void acceptControl(final ControlType control) {
		visitor.enter(control);
		if (!visitor.visitControl(control)) {
			return;
		}
		if (visitor.hasStopped()) {
			return;
		}

		visitor.leave(control);
	}

	public void acceptTextCell(final TextCellType textCell) {
		visitor.enter(textCell);
		if (!visitor.visitTextCell(textCell)) {
			return;
		}
		if (visitor.hasStopped()) {
			return;
		}

		visitor.leave(textCell);
	}

	public void acceptCustomCell(final CustomCellType customCell) {
		visitor.enter(customCell);
		if (!visitor.visitCustomCell(customCell)) {
			return;
		}
		if (visitor.hasStopped()) {
			return;
		}

		visitor.leave(customCell);
	}

	public void acceptExpressionCell(final ExpressionCellType expressionCell) {
		visitor.enter(expressionCell);
		if (!visitor.visitExpressionCell(expressionCell)) {
			return;
		}
		if (visitor.hasStopped()) {
			return;
		}

		visitor.leave(expressionCell);
	}

	public boolean acceptDetachedRepeat(final DetachedRepeatType repeat) {
		visitor.enter(repeat);
		if (!visitor.visitDetachedRepeat(repeat)) {
			return false;
		}
		if (visitor.hasStopped()) {
			return true;
		}

		acceptScreen(repeat.getScreen());
		if (visitor.hasStopped()) {
			return true;
		}

		if (repeat.isRowActionGroupSet()) {
			for (final RowActionType action: repeat.getRowActionGroup().getAction()) {
				visitor.visitRowAction(action);

				if (visitor.hasStopped()) {
					return true;
				}
			}
		}

		for (final RepeatOverviewColumnType column : repeat.getRepeatOverviewColumn()) {
			acceptRepeatOverviewColumn(column);

			if (visitor.hasStopped()) {
				return true;
			}
		}

		visitor.leave(repeat);
		return true;
	}

	public boolean acceptEmbeddedRepeat(final EmbeddedRepeatType repeat) {
		visitor.enter(repeat);
		if (!visitor.visitEmbeddedRepeat(repeat)) {
			return false;
		}
		if (visitor.hasStopped()) {
			return true;
		}

		acceptControlGrid(repeat.getControlGrid());
		if (visitor.hasStopped()) {
			return true;
		}

		if (repeat.isRowActionGroupSet()) {
			for (final RowActionType action: repeat.getRowActionGroup().getAction()) {
				visitor.visitRowAction(action);

				if (visitor.hasStopped()) {
					return true;
				}
			}
		}

		for (final RepeatOverviewColumnType column : repeat.getRepeatOverviewColumn()) {
			acceptRepeatOverviewColumn(column);

			if (visitor.hasStopped()) {
				return true;
			}
		}

		visitor.leave(repeat);
		return true;
	}

	public boolean acceptButtonPanel(final ButtonPanelType panel) {
		visitor.enter(panel);
		if (!visitor.visitButtonPanel(panel)) {
			return false;
		}
		if (visitor.hasStopped()) {
			return true;
		}

		for (final ButtonType button : panel.getButton()) {
			acceptButton(button);
			if (visitor.hasStopped()) {
				return true;
			}
		}

		visitor.leave(panel);
		return true;
	}

	public void acceptButton(final ButtonType button) {
		visitor.enter(button);
		if (!visitor.visitButton(button)) {
			return;
		}
		if (visitor.hasStopped()) {
			return;
		}

		visitor.leave(button);
	}

	public boolean acceptInlineRepeat(final InlineRepeatType repeat) {
		visitor.enter(repeat);
		if (!visitor.visitInlineRepeat(repeat)) {
			return false;
		}
		if (visitor.hasStopped()) {
			return true;
		}

		if (repeat.isRowActionGroupSet()) {
			for (final RowActionType action: repeat.getRowActionGroup().getAction()) {
				visitor.visitRowAction(action);

				if (visitor.hasStopped()) {
					return true;
				}
			}
		}

		for (final RepeatOverviewColumnType column : repeat.getRepeatOverviewColumn()) {
			acceptRepeatOverviewColumn(column);

			if (visitor.hasStopped()) {
				return true;
			}
		}

		visitor.leave(repeat);
		return true;
	}

	public boolean acceptRepeatOverviewColumn(final RepeatOverviewColumnType repeatOverviewColumn) {
		visitor.enter(repeatOverviewColumn);
		visitor.visitRepeatOverviewColumn(repeatOverviewColumn);
		visitor.leave(repeatOverviewColumn);
		return true;
	}

	public boolean acceptFieldConfigurationEntry(final FieldConfigurationEntryType fieldConfigurationEntry) {
		visitor.enter(fieldConfigurationEntry);
		visitor.visitFieldConfigurationEntry(fieldConfigurationEntry);
		visitor.leave(fieldConfigurationEntry);
		return true;
	}

	public boolean acceptScreenElement(final ScreenElementType screenElement) {
		if (screenElement instanceof SectionType) {
			return acceptSection((SectionType) screenElement);
		} else if (screenElement instanceof ControlGridType) {
			return acceptControlGrid((ControlGridType) screenElement);
		} else if (screenElement instanceof DetachedRepeatType) {
			return acceptDetachedRepeat((DetachedRepeatType) screenElement);
		} else if (screenElement instanceof EmbeddedRepeatType) {
			return acceptEmbeddedRepeat((EmbeddedRepeatType) screenElement);
		} else if (screenElement instanceof InlineRepeatType) {
			return acceptInlineRepeat((InlineRepeatType) screenElement);
		} else if (screenElement instanceof ButtonPanelType) {
			return acceptButtonPanel((ButtonPanelType) screenElement);
		} else if (screenElement instanceof CustomScreenElementType) {
			return acceptCustomScreenElement((CustomScreenElementType) screenElement);
		} else {
			throw new IllegalArgumentException("unknown screen element type" + screenElement.getClass().getName());
		}
	}

	public void acceptGenericRoot(final Object element) {
		if (element instanceof ButtonPanelType) {
			acceptButtonPanel((ButtonPanelType) element);
		} else if (element instanceof ButtonType) {
			acceptButton((ButtonType) element);
		} else if (element instanceof InlineRepeatType) {
			acceptInlineRepeat((InlineRepeatType) element);
		} else if (element instanceof ScreenType) {
			acceptScreen((ScreenType) element);
		} else if (element instanceof SectionType) {
			acceptSection((SectionType) element);
		} else if (element instanceof ControlGridType) {
			acceptControlGrid((ControlGridType) element);
		} else if (element instanceof RowType) {
			acceptRow((RowType) element);
		} else if (element instanceof TextCellType) {
			acceptTextCell((TextCellType) element);
		} else if (element instanceof ControlType) {
			acceptControl((ControlType) element);
		} else if (element instanceof DetachedRepeatType) {
			acceptDetachedRepeat((DetachedRepeatType) element);
		} else if (element instanceof EmbeddedRepeatType) {
			acceptEmbeddedRepeat((EmbeddedRepeatType) element);
		} else if (element instanceof CustomScreenElementType) {
			acceptCustomScreenElement((CustomScreenElementType) element);
		} else {
			System.out.println("acceptGenericRoot -- Not accept method found for object of type " + element.getClass()
																										   .getName());
		}
	}

	protected void walkSE(final Object element) {
		if (element instanceof InlineRepeatType) {
			acceptInlineRepeat((InlineRepeatType) element);
		} else if (element instanceof ButtonPanelType) {
			acceptButtonPanel((ButtonPanelType) element);
		} else if (element instanceof SectionType) {
			acceptSection((SectionType) element);
		} else if (element instanceof ControlGridType) {
			acceptControlGrid((ControlGridType) element);
		} else if (element instanceof DetachedRepeatType) {
			acceptDetachedRepeat((DetachedRepeatType) element);
		} else if (element instanceof EmbeddedRepeatType) {
			acceptEmbeddedRepeat((EmbeddedRepeatType) element);
		} else if (element instanceof CustomScreenElementType) {
			acceptCustomScreenElement((CustomScreenElementType) element);
		}
	}

	private void walkSEList(final Object parent, final List<ScreenElementType> list) {
		for (final ScreenElementType element : list) {
			walkSE(element);
			if (visitor.hasStopped()) {
				return;
			}
		}
	}
}
