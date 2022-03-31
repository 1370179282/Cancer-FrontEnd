import * as React from "react";
import debounce from "./debounce";
import { Table, Tag, Space, Input, PaginationProps } from "antd";
import { Pagination } from "antd";
import { pick } from "lodash-es";

const { Search } = Input;

interface filterTableProps {
  defaultPagination?: Pick<
    PaginationProps,
    "pageSize" | "pageSizeOptions" | "current"
  >;
  doSearch(params: Record<string, any>, cb): unknown;
  pageInfoAdapter?(params: PaginationProps): any;
  paramsAdapter?(params: any): any;
  initialValues?: string;
}

const ctx = React.createContext<
  Partial<
    filterTableProps & {
      dataSource;
      pagination;
      filter;
      statelessPropsRef;
    }
  >
>({});
const { Provider } = ctx;

export const FilterTableProvider: React.FC<filterTableProps> = (props) => {
  const {
    doSearch,
    children,
    defaultPagination = { pageSize: 10, current: 1 },
    initialValues = {},
  } = props;
  const doSearchDebounced = debounce(doSearch, 300);
  // 不需要受控的，搜索函数、setstate函数
  const statelessPropsRef = React.useRef<any>({
    filter: initialValues,
    pagination: defaultPagination,
    doSearch: doSearchDebounced,
  });
  React.useEffect(() => {
    statelessPropsRef.current.doSearch = doSearchDebounced;
  }, [doSearchDebounced]);

  // 需要受控的，分页、筛选、datasource、total
  const commonState = React.useMemo(
    () => ({
      statelessPropsRef,
      defaultPagination,
      initialValues: statelessPropsRef.current.filter,
    }),
    [statelessPropsRef, defaultPagination]
  );

  return <Provider value={commonState}>{children}</Provider>;
};

export const StandarForm: React.FC<{
  //items: React.ComponentProps<typeof Search>['items'];
  initialValues?: string;
  style?: React.CSSProperties;
  className?: string;
  useOld?: boolean; // 使用旧的源码
}> = ({ initialValues, className, style, useOld }) => {
  const commonState = React.useContext(ctx);
  const len = Object.keys(commonState).length;
  const S = Search;
  React.useEffect(() => {
    if (!len) {
      console.error("StandarForm must place in StandarSearchTableProvider!");
    }
  }, [len]);
  const [values, setValues] = React.useState(
    initialValues || commonState.initialValues || ""
  );
  return (
    <>
      <S
        className={className}
        {...{ style: style || {} }}
        //items={items}
        value={values}
        onChange={(e) => {
          setValues(e);
          // 背后改ref的参数
          // page相关要从头开始
          commonState.statelessPropsRef.current.pagination.currentPage = 1;
          commonState.statelessPropsRef.current.filter = e;
          // 触发搜索
          commonState.statelessPropsRef.current.trigger?.();
        }}
      />
    </>
  );
};

export const StandarTable: React.FC<
React.ComponentProps<typeof Table> & {
  standarTableApi?(apis: StandarTableApi): void;
}
> = props => {
  const commonState = React.useContext(ctx);
  const len = Object.keys(commonState).length;
  React.useEffect(() => {
    if (!len) {
      console.error('StandarTable must place in StandarSearchTableProvider!');
    }
  }, [len]);
  const {
    standarTableApi = () => {
      //
    },
    pagination: paginationInProps,
  } = props;
  const [dataSource, setDataSource] = React.useState([]);
  const [pagination, setPagination] = React.useState<Partial<typeof commonState['pagination']>>(
    paginationInProps || {}
  );
  const [loading, setLoading] = React.useState(false);
  standarTableApi({
    commitSearch: commonState.statelessPropsRef.current.trigger,
    getData() {
      return dataSource;
    },
    resetPagination(index) {
      setPagination(p => {
        commonState.statelessPropsRef.current.pagination.currentPage = index;
        const newP = { ...p };
        newP.currentPage = index;
        return newP;
      });
    },
    get total() {
      return pagination.total;
    },
    reset() {
      Object.assign(commonState.statelessPropsRef.current.pagination, commonState.defaultPagination || {});
      commonState.statelessPropsRef.current.filter = commonState.initialValues || {};
    },
  });
  React.useEffect(() => {
    // 搜索的具体实现
    commonState.statelessPropsRef.current.trigger = cb => {
      setLoading(true);
      commonState.statelessPropsRef.current.doSearch(
        {
          pagination: pick(commonState.statelessPropsRef.current.pagination, ['pageSize', 'currentPage']),
          filter: commonState.statelessPropsRef.current.filter,
        },
        ({ data, total }) => {
          cb?.({ data, total });
          setPagination(p => ({ ...p, ...commonState.statelessPropsRef.current.pagination, total: Number(total) }));
          setDataSource(data);
          setLoading(false);
        }
      );
    };
  }, [commonState.statelessPropsRef.current.doSearch, commonState.statelessPropsRef]);
  React.useEffect(() => {
    commonState.statelessPropsRef.current.trigger();
  }, [commonState.statelessPropsRef]);

  const handleChange = async (key: 'currentPage' | 'pageSize', value) => {
    setLoading(true);
    Object.assign(commonState.statelessPropsRef.current.pagination, { [key]: value });
    commonState.statelessPropsRef.current.doSearch(
      {
        pagination: {
          ...pick(commonState.statelessPropsRef.current.pagination, ['pageSize', 'currentPage']),
          [key]: value,
        },
        filter: commonState.statelessPropsRef.current.filter || {},
      },
      ({ data, total }) => {
        setPagination(p => ({ ...p, ...commonState.statelessPropsRef.current.pagination, total: Number(total) }));
        setDataSource(data);
        setLoading(false);
      }
    );
  };
  return (
    <Table
      {...props}
      loading={loading}
      dataSource={dataSource}
      pagination={{
        ...pagination,
        ...{
          showSizeChanger: true,
          onPageChange: currentPage => handleChange('currentPage', currentPage),
          onPageSizeChange: pageSize => handleChange('pageSize', pageSize),
        },
      }}
    />
  );
};