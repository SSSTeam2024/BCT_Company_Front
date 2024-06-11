import React, { useMemo } from 'react';
import TableContainer from "Common/TableContainer";
import { accountTransaction } from "Common/data";

const TransactionsTable = () => {
    const columns = useMemo(
        () => [
            {
                Header: "Transaction ID",
                accessor: "TransactionID",
                disableFilters: true,
                filterable: true,
            },
            {
                Header: "From",
                accessor: "From",
                disableFilters: true,
                filterable: true,
            },
            {
                Header: "To",
                accessor: "To",
                disableFilters: true,
                filterable: true,
            },
            {
                Header: "Timestamp",
                accessor: "Timestamp",
                disableFilters: true,
                filterable: true,
            },
            {
                Header: "Payment Method",
                accessor: "PaymentMethod",
                disableFilters: true,
                filterable: true,
            },
            {
                Header: "Amount",
                accessor: "Amount",
                disableFilters: true,
                filterable: true,
            },
            {
                Header: "Status",
                disableFilters: true,
                filterable: true,
                accessor: (cellProps: any) => {
                    switch (cellProps.Status) {
                        case "Success":
                            return (<span className="badge bg-success-subtle text-success text-uppercase"> {cellProps.Status}</span>)
                        case "Pending":
                            return (<span className="bg-warning-subtle text-uppercase"> {cellProps.Status}</span>)
                        case "Failed":
                            return (<span className="bg-danger-subtle text-uppercase"> {cellProps.Status}</span>)
                        default:
                            return (<span className="badge bg-success-subtle text-success text-uppercase"> {cellProps.Status}</span>)
                    }
                },
            },
        ],
        []
    );

    return (
        <React.Fragment>
            <TableContainer
                columns={(columns || [])}
                data={(accountTransaction || [])}
                isGlobalFilter={false}
                iscustomPageSize={false}
                isBordered={false}
                customPageSize={10}
                className="custom-header-css table align-middle table-nowrap"
                tableClass="table-centered align-middle table-nowrap mb-0"
                theadClass="text-muted table-light"
                SearchPlaceholder='Search Products...'
            />
        </React.Fragment>
    );
};

export default TransactionsTable;