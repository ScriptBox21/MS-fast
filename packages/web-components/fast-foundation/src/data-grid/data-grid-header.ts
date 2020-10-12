import {
    attr,
    FASTElement,
    html,
    RepeatBehavior,
    RepeatDirective,
    observable,
    ViewTemplate,
} from "@microsoft/fast-element";
import { DataGridColumn } from "./data-grid";

const defaultCellItemTemplate = html`
    <fast-data-grid-header-cell
        gridColumnIndex="${(x, c) => c.index + 1}"
        :columnData="${x => x}"
    ></fast-data-grid-header-cell>
`;

/**
 * A Data Grid header Custom HTML Element.
 *
 * @public
 */
export class DataGridHeader extends FASTElement {
    /**
     * String that gets applied to the the css gridTemplateColumns attribute for the header
     *
     * @public
     * @remarks
     * HTML Attribute: grid-template-columns
     */
    @attr
    public gridTemplateColumns: string;
    private gridTemplateColumnsChanged(): void {}

    /**
     * The column definitions of the row
     *
     * @public
     */
    @observable
    public columnsData: DataGridColumn[] | null = null;
    private columnsDataChanged(): void {}

    /**
     *
     *
     * @public
     */
    @observable cellElements?: object[];
    private cellElementsChanged() {}

    private cellsRepeatBehavior?: RepeatBehavior;
    private cellsPlaceholder?: Node;

    /**
     * @internal
     */
    public slottedCellElements: HTMLElement[];

    @observable
    public cellItemTemplate?: ViewTemplate = defaultCellItemTemplate;

    /**
     * @internal
     */
    public connectedCallback(): void {
        super.connectedCallback();

        this.cellsPlaceholder = document.createComment("");
        this.appendChild(this.cellsPlaceholder);

        this.cellsRepeatBehavior = new RepeatDirective(
            x => x.columnsData,
            x => x.cellItemTemplate,
            { positioning: true }
        ).createBehavior(this.cellsPlaceholder);

        this.$fastController.addBehaviors([this.cellsRepeatBehavior!]);

        this.updateHeaderStyle();
    }

    private updateHeaderStyle = (): void => {
        this.style.gridTemplateColumns = this.gridTemplateColumns;
    };
}