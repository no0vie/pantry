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
  Badge,
  Button,
  Input,
  Segmented,
  List,
  Empty,
} from "antd";
import {
  PlusOutlined,
  ShoppingCartOutlined,
  UnorderedListOutlined,
  TagsOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  TeamOutlined,
  BookOutlined,
  DownOutlined,
  UpOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import type { FormInstance } from "antd";
import type { Recipe, ShoppingItem, GroupByType } from "../types";
import ShoppingListItem from "./ShoppingListItem";
import { AVAILABLE_TAGS } from "../constants/tags";

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
  collapsedSections,
  setCollapsedSections,
  itemForm,
  setIsItemModalVisible,
  setEditingItem,
  handleEditItem,
  handleDeleteItem,
  handleToggleItem,
}) => {
  const getGroupedItems = (): { [key: string]: ShoppingItem[] } => {
    if (!selectedRecipe) return {};

    let items = selectedRecipe.shoppingList.filter((item) =>
      item.name.toLowerCase().includes(searchText.toLowerCase()),
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
              const tagName = tag?.name || tagId;
              if (!grouped[tagName]) grouped[tagName] = [];
              grouped[tagName].push(item);
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
          {/* Заголовок рецепта */}
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

          {/* Панель управления */}
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
                    options={[
                      {
                        label: "По рецепту",
                        value: "recipe",
                        icon: <BookOutlined />,
                      },
                      {
                        label: "По тегам",
                        value: "tag",
                        icon: <TagsOutlined />,
                      },
                      {
                        label: "Без группировки",
                        value: "none",
                        icon: <UnorderedListOutlined />,
                      },
                    ]}
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

          {/* Список покупок с группировкой */}
          {Object.entries(getGroupedItems()).map(([groupName, items]) => (
            <Card
              key={groupName}
              style={{ marginBottom: "24px" }}
              title={
                <Space>
                  <Text strong style={{ fontSize: "16px" }}>
                    {groupName}
                  </Text>
                  <Badge
                    count={items.length}
                    style={{ backgroundColor: "#1890ff" }}
                  />
                  <Badge
                    count={items.filter((i) => i.completed).length}
                    style={{ backgroundColor: "#52c41a" }}
                  >
                    <CheckCircleOutlined />
                  </Badge>
                </Space>
              }
              extra={
                <Button
                  type="text"
                  icon={
                    collapsedSections.includes(groupName) ? (
                      <DownOutlined />
                    ) : (
                      <UpOutlined />
                    )
                  }
                  onClick={() => {
                    if (collapsedSections.includes(groupName)) {
                      setCollapsedSections(
                        collapsedSections.filter((s) => s !== groupName),
                      );
                    } else {
                      setCollapsedSections([...collapsedSections, groupName]);
                    }
                  }}
                />
              }
            >
              {!collapsedSections.includes(groupName) &&
                (items.length > 0 ? (
                  <List
                    dataSource={items}
                    renderItem={(item) => (
                      <ShoppingListItem
                        item={item}
                        onEdit={handleEditItem}
                        onDelete={handleDeleteItem}
                        onToggle={handleToggleItem}
                      />
                    )}
                  />
                ) : (
                  <Empty description="Нет покупок в этой категории" />
                ))}
            </Card>
          ))}

          {Object.keys(getGroupedItems()).length === 0 && (
            <Empty
              description="Список покупок пуст"
              style={{ marginTop: "50px" }}
            >
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => {
                  setEditingItem(null);
                  itemForm.resetFields();
                  setIsItemModalVisible(true);
                }}
              >
                Добавить первую покупку
              </Button>
            </Empty>
          )}
        </>
      ) : (
        <Empty
          description="Выберите рецепт или создайте новый"
          style={{ marginTop: "100px" }}
        />
      )}
    </Content>
  );
};

export default RecipeCard;
