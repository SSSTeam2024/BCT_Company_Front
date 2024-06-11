import React, { useEffect } from 'react';
import withRouter from 'Common/withRouter';

//redux
import { useSelector } from "react-redux";
import { createSelector } from 'reselect';

const NonAuthLayout = ({ children }: any) => {

    const selectProperties = createSelector(
        (state: any) => state.Layout,
        (layout) => ({
            layoutModeType: layout.layoutModeType,
        })
    );
    const {
        layoutModeType,
    } = useSelector(selectProperties);

    useEffect(() => {
        if (layoutModeType === "dark") {
            document.body.setAttribute("data-bs-theme", "dark");
        } else {
            document.body.setAttribute("data-bs-theme", "light");
        }
        return () => {
            document.body.removeAttribute("data-bs-theme");
        };
    }, [layoutModeType]);
    return (
        <React.Fragment>
            <div>
                {children}
            </div>
        </React.Fragment>
    );
};

export default withRouter(NonAuthLayout);