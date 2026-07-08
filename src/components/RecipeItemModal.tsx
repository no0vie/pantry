import React, { useCallback, useEffect, useState } from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  Button,
  Space,
  Tag,
  AutoComplete,
  InputNumber,
} from "antd";
import { AVAILABLE_TAGS, TAG_ICON_MAP } from "../constants/ui";
import type { ShoppingItem, TagType, Recipe } from "../types";
import { shoppingItemState } from "../states/ShoppingItemState";
import { BaseOptionType } from "antd/es/select";

interface RecipeItemModalProps {
  recepies?: Recipe[];
  visible: boolean;
  onClose: () => void;
  onSubmit: (values: any) => void;
  editingItem: ShoppingItem | null;
}

const RecipeItemModal: React.FC<RecipeItemModalProps> = ({
  visible,
  onClose,
  onSubmit,
  recepies = [],
  editingItem,
}) => {
  const [form] = Form.useForm<ShoppingItem>();
  const title = editingItem ? "Редактировать покупку" : "Добавить покупку";
  const submitText = editingItem ? "Сохранить" : "Добавить";
  const [quantityList, setQuantityList] = useState<BaseOptionType[]>([]);
  const [isQuantityChangeAvailable, setIsQuantityChangeAvailable] =
    useState<boolean>(false);
  useEffect(() => {
    if (editingItem) {
      form.setFieldsValue(editingItem);
      const nameVal = editingItem.name;
      if (nameVal) {
        const nameQuantityList =
          shoppingItemState.quantityItemMap[nameVal] || [];
        setQuantityList(
          nameQuantityList.map((item) => ({ label: item, value: item })),
        );
      }
      setIsQuantityChangeAvailable(true);
    } else {
      form.resetFields();
      setQuantityList([]);
      setIsQuantityChangeAvailable(false);
    }
  }, [editingItem, form]);

  const onValuesChange = useCallback(
    (changedFields: Partial<ShoppingItem>) => {
      const nameVal = changedFields.name;

      if (nameVal) {
        const nameQuantityList =
          shoppingItemState.quantityItemMap[nameVal] || [];
        setQuantityList(
          nameQuantityList.map((item) => ({ label: item, value: item })),
        );
      } else {
        setQuantityList([]);
      }

      setIsQuantityChangeAvailable(!!nameVal || !!editingItem);
    },
    [shoppingItemState.quantityItemMap, editingItem, form],
  );

  const getTagIcon = (tagId: TagType) => {
    const tag = AVAILABLE_TAGS.find((t) => t.id === tagId);
    if (!tag) return null;
    const IconComp = TAG_ICON_MAP[tag.icon];
    return <IconComp />;
  };

  return (
    <Modal title={title} open={visible} onCancel={onClose} footer={null}>
      <Form<ShoppingItem>
        form={form}
        layout="vertical"
        onValuesChange={onValuesChange}
        onFinish={onSubmit}
      >
        <Form.Item
          name="name"
          label="Название"
          rules={[{ required: true, message: "Введите название" }]}
        >
          <Input placeholder="Например: Картофель" />
        </Form.Item>

        <Form.Item
          name="value"
          label="Количество"
          rules={[{ required: true, message: "Введите количество единиц" }]}
        >
          <InputNumber
            min={1}
            placeholder="500"
            disabled={!isQuantityChangeAvailable}
          />
        </Form.Item>

        <Form.Item
          name="quantity"
          label="Условная единица"
          rules={[{ required: true, message: "Укажите условную единицу" }]}
        >
          <AutoComplete
            placeholder="Например: шт или г"
            options={quantityList}
            disabled={!isQuantityChangeAvailable}
          />
        </Form.Item>

        {!!recepies.length && (
          <Form.Item
            name="recipe"
            label="Рецепт"
            rules={[{ required: true, message: "Выберите рецепт" }]}
          >
            <Select placeholder="Выберите рецепт">
              {recepies.map((recipe) => (
                <Select.Option key={recipe.id} value={recipe.id}>
                  {recipe.title}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        )}

        <Form.Item name="tags" label="Теги">
          <Select mode="multiple" placeholder="Выберите теги" allowClear>
            {AVAILABLE_TAGS.map((tag) => (
              <Select.Option key={tag.id} value={tag.id}>
                <Space>
                  {getTagIcon(tag.id)}
                  <Tag color={tag.color}>{tag.name}</Tag>
                </Space>
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            {submitText}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default RecipeItemModal;
