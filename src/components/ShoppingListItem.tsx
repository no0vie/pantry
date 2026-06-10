import React from "react";
import {
  List,
  Tooltip,
  Button,
  Popconfirm,
  Checkbox,
  Space,
  Tag,
  Typography,
} from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import type { ShoppingItem } from "../types";
import { AVAILABLE_TAGS, TAG_ICON_MAP } from "../constants/ui";

const { Text } = Typography;

const getTagIcon = (tagId: string) => {
  const tag = AVAILABLE_TAGS.find((t) => t.id === tagId);
  if (!tag) return null;
  const IconComponent = TAG_ICON_MAP[tag.icon];
  return <IconComponent />;
};

export interface ShoppingListItemProps {
  item: ShoppingItem;
  onEdit: (item: ShoppingItem) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
}

const ShoppingListItem: React.FC<ShoppingListItemProps> = ({
  item,
  onEdit,
  onDelete,
  onToggle,
}) => (
  <List.Item
    actions={[
      <Tooltip title="Редактировать" key="edit">
        <Button
          type="text"
          icon={<EditOutlined />}
          onClick={() => onEdit(item)}
        />
      </Tooltip>,
      <Popconfirm
        title="Удалить пункт?"
        onConfirm={() => onDelete(item.id)}
        okText="Да"
        cancelText="Нет"
        key="delete"
      >
        <Button type="text" danger icon={<DeleteOutlined />} />
      </Popconfirm>,
    ]}
  >
    <List.Item.Meta
      avatar={
        <Checkbox checked={item.completed} onChange={() => onToggle(item.id)} />
      }
      title={
        <Text
          style={{
            textDecoration: item.completed ? "line-through" : "none",
            color: item.completed ? "#999" : "#000",
          }}
        >
          {item.name}
        </Text>
      }
      description={
        <Space size={4} wrap>
          <Text type="secondary">{item.amount}</Text>
          {item.tags.map((tagId) => {
            const tag = AVAILABLE_TAGS.find((t) => t.id === tagId);
            return tag ? (
              <Tag
                key={tagId}
                color={tag.color}
                icon={getTagIcon(tagId)}
                style={{ margin: "2px" }}
              >
                {tag.name}
              </Tag>
            ) : null;
          })}
        </Space>
      }
    />
  </List.Item>
);

export default ShoppingListItem;
