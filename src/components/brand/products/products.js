import React, {useEffect, useState} from 'react';
import useStyles from './style';
import {Link, useLocation, useParams} from "react-router-dom";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Breadcrumbs from '@mui/material/Breadcrumbs';
import MuiLink from '@mui/material/Link';
import Button from '@mui/material/Button';
import Pagination from '@mui/material/Pagination';
import CircularProgress from '@mui/material/CircularProgress';

import ProductGridView from "../../product/productList/productGridView";
import ProductListView from "../../product/productList/productListView";
import MultiSelctFilter from "../../common/Filters/MultiSelctFilter";

import {ReactComponent as ListViewIcon} from '../../../assets/images/listView.svg';
import {ReactComponent as GridViewIcon} from '../../../assets/images/gridView.svg';

import useCancellablePromise from "../../../api/cancelRequest";
import no_image_found from "../../../assets/images/no_image_found.png";
import {getAllProductRequest} from "../../../api/product.api";

const Products = ({brandDetails}) => {
    const classes = useStyles();
    const {brandId} = useParams();
    const {descriptor} = brandDetails;
    const {name: brandName, images} = descriptor;

    const [viewType, setViewType] = useState("grid");
    const [products, setProducts] = useState([]);
    const [totalProductCount, setTotalProductCount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [paginationModel, setPaginationModel] = useState({
        page: 1,
        pageSize: 10,
        searchData: []
    });

    // HOOKS
    const { cancellablePromise } = useCancellablePromise();

    const getAllProducts = async(brandId) => {
        setIsLoading(true);
        try {
            const paginationData = Object.assign({}, JSON.parse(JSON.stringify(paginationModel)));
            paginationData.searchData.brandId = brandId || "";
            const data = await cancellablePromise(
                getAllProductRequest(paginationData)
            );
            console.log("getAllProducts=====>", data)
            setProducts(data.data);
            setTotalProductCount(data.count);
        } catch (err) {
            // dispatch({
            //     type: toast_actions.ADD_TOAST,
            //     payload: {
            //         id: Math.floor(Math.random() * 100),
            //         type: toast_types.error,
            //         message: err?.message,
            //     },
            // });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if(brandId){
            getAllProducts(brandId);
            // getAllFilters();
        }
    }, [brandId]);

    const handleChangeFilter = (filterIndex, value) => {
        const data = Object.assign({}, JSON.parse(JSON.stringify(paginationModel)));
        data.searchData[filterIndex].selectedValues = value;
        data.page = 0;
        data.pageSize = 10;
        setPaginationModel(data);
    };

    return (
        <Grid container spacing={3} className={classes.productContainer}>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <div role="presentation">
                    <Breadcrumbs aria-label="breadcrumb">
                        <MuiLink component={Link} underline="hover" color="inherit" to="/application/products">
                            Home
                        </MuiLink>
                        {
                            brandName && (
                                <Typography color="text.primary">{brandName}</Typography>
                            )
                        }
                    </Breadcrumbs>
                </div>
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12} className={classes.catNameTypoContainer}>
                <Typography variant="h4" className={classes.catNameTypo} color={"success"}>
                    <img className={classes.brandIcon} src={images?.length > 0 ? images[0] : no_image_found} alt={`brand-icon`} />
                </Typography>
                {
                    products.length > 0 && (
                        <>
                            <Button
                                className={classes.viewTypeButton}
                                variant={viewType === "grid"?"contained":"outlined"}
                                color={viewType === "grid"?"primary":"inherit"}
                                onClick={() => setViewType("grid")}
                            >
                                <GridViewIcon/>
                            </Button>
                            <Button
                                className={classes.viewTypeButton}
                                variant={viewType === "list"?"contained":"outlined"}
                                color={viewType === "list"?"primary":"inherit"}
                                onClick={() => setViewType("list")}
                            >
                                <ListViewIcon/>
                            </Button>
                        </>
                    )
                }
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                {
                    paginationModel.searchData && paginationModel.searchData.length > 0 && paginationModel.searchData.map((filter, filterIndex) => {
                        return (
                            <MultiSelctFilter
                                key={`filter-${filter.code}-${filterIndex}`}
                                arrayList={filter?.options || []}
                                filterName={filter.code}
                                title={filter.code}
                                filterOn="id"
                                saveButtonText="Apply"
                                value={filter?.selectedValues || []}
                                onChangeFilter={(value) => handleChangeFilter(filterIndex, value)}
                                clearButtonText="Clear"
                                disabled={false}
                            />
                        )
                    })
                }
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <Grid container spacing={4}>
                    {
                        isLoading
                        ?(
                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                <CircularProgress />
                            </Grid>
                        ):(
                            <>
                                {
                                    products.length > 0
                                    ?(
                                        <>
                                            {
                                                products.map((productItem, ind) => {
                                                    if(viewType === 'list'){
                                                        return (
                                                            <Grid key={`product-item-${ind}`} item xs={12} sm={12} md={12} lg={12} xl={12} className={classes.listViewContainer}>
                                                                <ProductListView
                                                                    product={productItem?.item_details}
                                                                    productId={productItem.id}
                                                                    price={productItem?.item_details?.price}
                                                                    bpp_provider_descriptor={
                                                                        productItem?.provider_details?.descriptor
                                                                    }
                                                                    bpp_id={productItem?.bpp_details?.bpp_id}
                                                                    location_id={
                                                                        productItem?.location_details
                                                                            ? productItem.location_details?.id
                                                                            : ""
                                                                    }
                                                                    bpp_provider_id={productItem?.provider_details?.id}
                                                                />
                                                            </Grid>
                                                        )
                                                    }else{
                                                        return (
                                                            <Grid key={`product-item-${ind}`} item xs={12} sm={12} md={3} lg={3} xl={3}>
                                                                <ProductGridView
                                                                    product={productItem?.item_details}
                                                                    productId={productItem.id}
                                                                    price={productItem?.item_details?.price}
                                                                    bpp_provider_descriptor={
                                                                        productItem?.provider_details?.descriptor
                                                                    }
                                                                    bpp_id={productItem?.bpp_details?.bpp_id}
                                                                    location_id={
                                                                        productItem?.location_details
                                                                            ? productItem.location_details?.id
                                                                            : ""
                                                                    }
                                                                    bpp_provider_id={productItem?.provider_details?.id}
                                                                />
                                                            </Grid>
                                                        )
                                                    }
                                                })
                                            }
                                        </>
                                    ):(
                                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <Typography variant="body1">
                                                No Products available
                                            </Typography>
                                        </Grid>
                                    )
                                }
                            </>
                        )
                    }
                </Grid>
            </Grid>
            {
                products.length > 0 && (
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12} className={classes.paginationContainer}>
                        <Pagination
                            className={classes.pagination}
                            count={Math.ceil(totalProductCount/paginationModel.pageSize)}
                            shape="rounded"
                            color="primary"
                            page={paginationModel.page}
                            onChange={(evant, page) => {
                                let paginationData = Object.assign({}, paginationModel);
                                paginationData.page = page;
                                setPaginationModel(paginationData);
                            }}
                        />
                    </Grid>
                )
            }
        </Grid>
    )

};

export default Products;