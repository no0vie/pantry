import React from "react";
import {
  Layout,
  Card,
  Row,
  Col,
  Typography,
  Space,
  Tag,
  Statistic,
  Progress,
  Button,
  Input,
  Segmented,
} from "antd";
import {
  PlusOutlined,
  ShoppingCartOutlined,
  ClockCircleOutlined,
  TeamOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import type { FormInstance } from "antd";
import type { Recipe, ShoppingItem, GroupByType } from "../types";
import ShoppingListItem from "./ShoppingListItem";
import { AVAILABLE_TAGS, GROUP_BY_OPTIONS } from "../constants/ui";

const { Content } = Layout;
const { Title, Paragraph, Text } = Typography;

interface RecipeCardProps {
  selectedRecipe: Recipe | null;
  currentStats: { total: number; completed: number; percentage: number };
  groupBy: GroupByType;
  setGroupBy: (value: GroupByType) => void;
  searchText: string;
  setSearchText: (value: string) => void;
  collapsedSections: string[];
  setCollapsedSections: (value: string[]) => void;
  itemForm: FormInstance;
  setIsItemModalVisible: (visible: boolean) => void;
  setEditingItem: (item: ShoppingItem | null) => void;
  handleEditItem: (item: ShoppingItem) => void;
  handleDeleteItem: (id: string) => void;
  handleToggleItem: (id: string) => void;
}

const RecipeCard: React.FC<RecipeCardProps> = ({
  selectedRecipe,
  currentStats,
  groupBy,
  setGroupBy,
  searchText,
  setSearchText,
  itemForm,
  setIsItemModalVisible,
  setEditingItem,
  handleEditItem,
  handleDeleteItem,
  handleToggleItem,
}) => {
  const getGroupedItems = (): { [key: string]: ShoppingItem[] } => {
    if (!selectedRecipe) return {};
    let items = selectedRecipe.shoppingList.filter((i) =>
      i.name.toLowerCase().includes(searchText.toLowerCase()),
    );
    switch (groupBy) {
      case "recipe":
        return { [selectedRecipe.title]: items };
      case "tag": {
        const grouped: { [key: string]: ShoppingItem[] } = {};
        items.forEach((item) => {
          if (item.tags.length === 0) {
            if (!grouped["Без тега"]) grouped["Без тега"] = [];
            grouped["Без тега"].push(item);
          } else {
            item.tags.forEach((tagId) => {
              const tag = AVAILABLE_TAGS.find((t) => t.id === tagId);
              const name = tag?.name || tagId;
              if (!grouped[name]) grouped[name] = [];
              grouped[name].push(item);
            });
          }
        });
        return grouped;
      }
      case "none":
        return { "Все покупки": items };
      default:
        return { [selectedRecipe.title]: items };
    }
  };

  return (
    <Content style={{ padding: "24px", background: "#f5f5f5" }}>
      {selectedRecipe ? (
        <>
          <Card style={{ marginBottom: "24px" }}>
            <Row gutter={16} align="middle">
              <Col flex="auto">
                <Title level={2} style={{ margin: 0 }}>
                  {selectedRecipe.title}
                </Title>
                {selectedRecipe.description && (
                  <Paragraph style={{ marginTop: "8px", marginBottom: 0 }}>
                    {selectedRecipe.description}
                  </Paragraph>
                )}
                <Space style={{ marginTop: "12px" }}>
                  {selectedRecipe.cookingTime && (
                    <Tag icon={<ClockCircleOutlined />} color="blue">
                      {selectedRecipe.cookingTime} минут
                    </Tag>
                  )}
                  {selectedRecipe.servings && (
                    <Tag icon={<TeamOutlined />} color="green">
                      {selectedRecipe.servings} порций
                    </Tag>
                  )}
                  <Text type="secondary">
                    Обновлено:{" "}
                    {selectedRecipe.updatedAt?.toLocaleDateString?.()}
                  </Text>
                </Space>
              </Col>
              <Col>
                <Card size="small">
                  <Statistic
                    title="Прогресс покупок"
                    value={currentStats.percentage}
                    suffix="%"
                    prefix={<ShoppingCartOutlined />}
                  />
                  <Progress
                    percent={currentStats.percentage}
                    size="small"
                    style={{ marginTop: "8px" }}
                  />
                  <Text type="secondary" style={{ fontSize: "12px" }}>
                    {currentStats.completed} из {currentStats.total} куплено
                  </Text>
                </Card>
              </Col>
            </Row>
          </Card>

          <Card style={{ marginBottom: "24px" }}>
            <Row gutter={16} align="middle">
              <Col flex="auto">
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
                </Space>
              </Col>
              <Col>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => {
                    setEditingItem(null);
                    itemForm.resetFields();
                    setIsItemModalVisible(true);
                  }}
                >
                  Добавить покупку
                </Button>
              </Col>
            </Row>
          </Card>

          {Object.entries(getGroupedItems()).map(([groupName, items]) => (
            <React.Fragment key={groupName}>
              <Card style={{ marginBottom: "12px" }} title={groupName}>
                {items.map((item) => (
                  <ShoppingListItem
                    key={item.id}
                    item={item}
                    onEdit={handleEditItem}
                    onDelete={handleDeleteItem}
                    onToggle={handleToggleItem}
                  />
                ))}
              </Card>
            </React.Fragment>
          ))}
        </>
      ) : null}
    </Content>
  );
};

export default RecipeCard;
