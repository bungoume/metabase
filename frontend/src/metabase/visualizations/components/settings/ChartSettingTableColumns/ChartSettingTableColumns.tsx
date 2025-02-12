import { useState } from "react";
import { t } from "ttag";

import { FieldPanel } from "metabase/querying";
import { Button } from "metabase/ui";
import type * as Lib from "metabase-lib";
import type Question from "metabase-lib/Question";
import type {
  DatasetColumn,
  TableColumnOrderSetting,
} from "metabase-types/api";

import { TableColumnPanel } from "./TableColumnPanel";
import type { EditWidgetData } from "./types";
import { canEditQuery } from "./utils";

interface ChartSettingTableColumnsProps {
  value: TableColumnOrderSetting[];
  columns: DatasetColumn[];
  question?: Question;
  isDashboard?: boolean;
  getColumnName: (column: DatasetColumn) => string;
  onChange: (value: TableColumnOrderSetting[], question?: Question) => void;
  onShowWidget: (config: EditWidgetData, targetElement: HTMLElement) => void;
}

export const ChartSettingTableColumns = ({
  value,
  columns,
  question,
  isDashboard,
  getColumnName,
  onChange,
  onShowWidget,
}: ChartSettingTableColumnsProps) => {
  const [isEditingQuery, setIsEditingQuery] = useState(false);
  if (!question) {
    return null;
  }

  const query = question.query();
  const stageIndex = -1;
  const hasEditButton = canEditQuery(query, isDashboard);

  const handleQueryChange = (query: Lib.Query) => {
    onChange(value, question.setQuery(query));
  };

  return (
    <div>
      {hasEditButton && (
        <Button
          pl="0"
          variant="subtle"
          onClick={() => setIsEditingQuery(!isEditingQuery)}
        >
          {isEditingQuery ? t`Done picking columns` : t`Add or remove columns`}
        </Button>
      )}
      {isEditingQuery ? (
        <FieldPanel
          query={query}
          stageIndex={stageIndex}
          onChange={handleQueryChange}
        />
      ) : (
        <TableColumnPanel
          query={query}
          stageIndex={stageIndex}
          columns={columns}
          columnSettings={value}
          getColumnName={getColumnName}
          onChange={onChange}
          onShowWidget={onShowWidget}
        />
      )}
    </div>
  );
};
