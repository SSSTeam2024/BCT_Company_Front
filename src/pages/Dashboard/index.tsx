import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import CustomerSatisfaction from './CustomerSatisfaction';

import ProductDelivery from './ProductDelivery';
import StockReport from './StockReport';
import TopCategories from './TopCategories';

import TopSalesLocation from './TopSalesLocation';
import Widgets from './Widgets';
import RecentOrders from './RecentOrders';
import Revenue from './Revenue';
import TopTrips from './TopTrips';
import NewEmployees from './NewEmployees';

const Dashboard = () => {

    document.title = "Dashboard | Toner eCommerce + Admin React Template";

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <Row>
                        <Col xxl={12} lg={6} className="order-first">
                            <Row className="row-cols-xxl-4 row-cols-1">
                                <Widgets />
                            </Row>
                        </Col>
                        {/* <Revenue />
                        <TopSalesLocation />
                    </Row>
                    <Row>
                        <RecentOrders />*/}
                    </Row> 
                    <Row className='widget-responsive-fullscreen'>
                        {/* <CustomerSatisfaction />
                        <StockReport /> */}
                        <ProductDelivery />
                        <TopCategories />
                        <NewEmployees />
                        <TopTrips />
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default Dashboard;