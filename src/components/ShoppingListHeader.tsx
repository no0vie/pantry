import React from "react";
import { Card, Input, Button, Segmented, Space } from "antd";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import type { GroupByType } from "../types";
import { GROUP_BY_OPTIONS } from "../constants/ui";

export interface ShoppingListHeaderProps {
  searchText: string;
  setSearchText: (value: string) => void;
  groupBy: GroupByType;
  setGroupBy: (value: GroupByType) => void;
  onAdd: () => void;
}

const ShoppingListHeader: React.FC<ShoppingListHeaderProps> = ({
  searchText,
  setSearchText,
  groupBy,
  setGroupBy,
  onAdd,
}) => (
  <Card style={{ marginBottom: "24px" }}>
    <Space size="large">
      <Input
        placeholder="Поиск по списку..."
        prefix={<SearchOutlined />}
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        style={{ width: "250px" }}
        allowClear
      />
      <Segmented
        value={groupBy}
        onChange={(value) => setGroupBy(value as GroupByType)}
        options={GROUP_BY_OPTIONS}
      />
      <Button type="primary" icon={<PlusOutlined />} onClick={onAdd}>
        Добавить покупку
      </Button>
    </Space>
  </Card>
);

export default ShoppingListHeader;
