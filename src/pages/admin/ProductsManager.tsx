import { Table, Space, Button, Tag, Image, Input, Popconfirm, message } from "antd";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { IProducts } from "../../types/products";

interface IProps {
    data: IProducts[],
    onRemove(id: string): void
}
interface IProductKey extends IProducts {
    key?: string
}

function ProductsManager(props: IProps) {
    const { data, onRemove } = props
    const [currentData, setCurrentData] = useState<IProductKey[]>(data)
    const [searchValue, setSearchValue] = useState<string>("")
    const [loading, setLoading] = useState(false)
    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            sorter: (a: any, b: any) => a.name.length - b.name.length
        },
        {
            title: 'Image',
            dataIndex: 'image',
            key: 'image',
            render: (imageUrl: string) => <Image src={imageUrl} alt="image" />
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
            sorter: (a: any, b: any) => a.price - b.price,
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Categories',
            key: 'categories',
            render: (_: any, record: any) => (
                <Space wrap size="middle">
                    {record.categories.map((cate: any) => (
                        <Tag>{cate.name}</Tag>
                    ))}
                </Space>
            ),
        },
        {
            title: 'Action',
            key: 'action',
            render: (_: any, record: any) => (
                <Space size="middle">
                    <Button danger><Link to={"/products/" + record._id}>View</Link></Button>
                    <Button type="text" danger><Link to={"/admin/products/update/" + record._id}>Update</Link></Button>
                    <Popconfirm
                        title="Delete the Product"
                        description="Are you sure to delete this product?"
                        onConfirm={(e: any) => confirm(e, record._id)}
                        onCancel={() => message.error('Denined')}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button type="primary" danger>Delete</Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    const confirm = (e: React.MouseEvent<HTMLElement>, id: string) => {
        console.log(e);
        onRemove(id)
    };

    const handleSearch = (e: any) => {
        setSearchValue(e.target.value);
        const filterSearch = data.filter(item => {
            return item.name.toLowerCase().includes(e.target.value.toLowerCase())
        })
        setCurrentData(filterSearch);
    }

    useEffect(() => {
        setLoading(true)
        const newArr: IProductKey[] = data?.map(product => {
            let item: IProductKey = { ...product, key: product._id }
            return item
        })
        setLoading(false)
        setCurrentData(newArr)
    }, [data])

    return (
        <div className="products">
            <h1>Products Manager</h1>
            <div style={{ width: "100%", display: 'flex', justifyContent: 'end', alignItems: 'center' }}>
                <Input.Search
                    allowClear
                    enterButton="Search"
                    size="large"
                    placeholder="Search Product by Name"
                    value={searchValue}
                    onChange={handleSearch}
                    style={{ margin: '20px 0', width: '30%' }}
                />
            </div>
            <Table
                loading={loading}
                pagination={{
                    pageSize: 5
                }}
                dataSource={currentData}
                columns={columns}
            />
        </div>
    );
}

export default ProductsManager;