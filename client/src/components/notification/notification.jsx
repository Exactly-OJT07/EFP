import {
    CheckCircleFilled,
    ExclamationCircleFilled,
    InfoCircleFilled,
    WarningFilled,
} from "@ant-design/icons";
import { notification } from "antd";
import { NotificationType } from "../constants/constants";
import "./notification.css";

export const openNotificationWithIcon = (type, description) => {
    let icon = <CheckCircleFilled style={{ color: "white" }} />;

    switch (type) {
        case NotificationType.INFO:
        icon = <InfoCircleFilled style={{ color: "white" }} />;
        break;
        case NotificationType.ERROR:
        icon = <ExclamationCircleFilled style={{ color: "white" }} />;
        break;
        case NotificationType.WARNING:
        icon = <WarningFilled style={{ color: "white" }} />;
        break;
        case NotificationType.SUCCESS:
        icon = <CheckCircleFilled style={{ color: "white" }} />;
        break;
    }

    notification[type]({
        message: description,
        className: `notification-${type}`,
        closeIcon: <></>,
        placement: "topRight",
        icon: icon,
    });
};
