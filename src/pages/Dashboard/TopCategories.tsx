import CustomDropdownToggle from 'Common/CustomDropdownToggle';
import React from 'react';
import { Card, Col, Dropdown, Row } from 'react-bootstrap';
import { TopCategoriesChart } from './DashboardCharts';

const TopCategories = () => {
    return (
        <React.Fragment>
             <Col xxl={3} lg={6}>
                <Card className="card-height-100">
                    <Card.Header className="align-items-center d-flex">
                        <h4 className="card-title mb-0 flex-grow-1">Payments</h4>
                        {/* <div className="flex-shrink-0">
                            <Dropdown className="flex-shrink-0">
                                <Dropdown.Toggle as={CustomDropdownToggle} href="#" className="text-reset dropdown-btn">
                                    <span className="text-muted">Report<i className="mdi mdi-chevron-down ms-1"></i></span>
                                </Dropdown.Toggle>
                                <Dropdown.Menu className="dropdown-menu dropdown-menu-end">
                                    <Dropdown.Item className="dropdown-item" href="#">Download Report</Dropdown.Item>
                                    <Dropdown.Item className="dropdown-item" href="#">Export</Dropdown.Item>
                                    <Dropdown.Item className="dropdown-item" href="#">Import</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </div> */}
                    </Card.Header>
            
                    <Card.Body>
                        <div id="multiple_radialbar" dir="ltr">
                        <TopCategoriesChart dataColors='["--tb-primary", "--tb-danger", "--tb-success", "--tb-secondary"]' />
                        </div>

                        <Row className="g-3">
                            <Col md={6}>
                                <Card className="text-center border-dashed mb-0">
                                    <Card.Body>
                                        <h6 className="fs-16">9860</h6>
                                        <i className="bi bi-square-fill text-primary me-1 fs-11"></i> Total
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col md={6}>
                                <Card className="text-center border-dashed mb-0">
                                    <Card.Body>
                                        <h6 className="fs-16">5430</h6>
                                        <i className="bi bi-square-fill text-danger me-1 fs-11"></i> Unpaid
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col md={6}>
                                <Card className="text-center border-dashed mb-0">
                                    <Card.Body>
                                        <h6 className="fs-16">4430</h6>
                                        <i className="bi bi-square-fill text-success me-1 fs-11"></i>Paid
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col md={6}>
                                <Card className="text-center border-dashed mb-0">
                                    <Card.Body>
                                        <h6 className="fs-16">1200</h6>
                                        <i className="bi bi-square-fill text-secondary me-1 fs-11"></i> This Month
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card> 
            </Col>
        </React.Fragment>
    );
}

export default TopCategories;