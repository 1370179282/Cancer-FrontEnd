// import * as React from 'react';
// import SemiReactFilter, { SelectList } from '@ies/semi-react-filter';
// import SemiReactFilterOld from '@/components/SemiReactFilter';
// import { Table } from '@ies/semi-ui-react';
// import { PaginationProps } from '@ies/semi-ui-react/pagination';
// import { useDebounceFunction } from '@/common/utils/hook';
// import AuditSemiReactSortBtn from '@ies/audit-semi-react-sort-btn';
// import { omit, pick } from '@/common/utils/object';
// import { I18n } from '@sdks/i18n';
// import { DISPLAY_TYPE, SORT_TYPE } from '@/pages/TagList/components/Static';

// interface StandarSearchTableProps {
//   defaultPagination?: Pick<PaginationProps, 'pageSize' | 'pageSizeOpts' | 'currentPage'>;
//   doSearch(params: Record<string, any>, cb): unknown;
//   pageInfoAdapter?(params: PaginationProps): any;
//   paramsAdapter?(params: any): any;
//   initialValues?: Record<string, any>;
// }

// const ctx = React.createContext<
// Partial<
// StandarSearchTableProps & {
//   dataSource;
//   pagination;
//   filter;
//   statelessPropsRef;
// }
// >
// >({});
// const { Provider } = ctx;

// const StandarSearchTableProvider: React.FC<StandarSearchTableProps> = props => {
//   const { doSearch, children, defaultPagination = { pageSize: 10, currentPage: 1 }, initialValues = {} } = props;
//   const doSearchDebounced = useDebounceFunction(doSearch, 300, [doSearch]);
//   // 不需要受控的，搜索函数、setstate函数
//   const statelessPropsRef = React.useRef<any>({
//     filter: initialValues,
//     pagination: defaultPagination,
//     doSearch: doSearchDebounced,
//   });
//   React.useEffect(() => {
//     statelessPropsRef.current.doSearch = doSearchDebounced;
//   }, [doSearchDebounced]);
//   // 需要受控的，分页、筛选、datasource、total
//   const commonState = React.useMemo(
//     () => ({
//       statelessPropsRef,
//       defaultPagination,
//       initialValues: statelessPropsRef.current.filter,
//     }),
//     [statelessPropsRef, defaultPagination]
//   );

//   return <Provider value={commonState}>{children}</Provider>;
// };

// export const StandarForm: React.FC<{
//   items: React.ComponentProps<typeof SemiReactFilter>['items'];
//   initialValues?: Record<string, any>;
//   style?: React.CSSProperties;
//   className?: string;
//   useOld?: boolean; // 使用旧的源码
// }> = ({ items, initialValues, className, style, useOld }) => {
//   const commonState = React.useContext(ctx);
//   const len = Object.keys(commonState).length;
//   const C = useOld ? SemiReactFilterOld : SemiReactFilter;
//   React.useEffect(() => {
//     if (!len) {
//       console.error('StandarForm must place in StandarSearchTableProvider!');
//     }
//   }, [len]);
//   const [values, setValues] = React.useState(initialValues || commonState.initialValues || {});
//   commonState.statelessPropsRef.current.resetFormValues = () => {
//     // ui上的重置
//     setValues(initialValues || commonState.initialValues || {});
//   };
//   return (
//     <>
//       <C
//         className={className}
//         {...{ style: style || {} }}
//         items={items}
//         cancelText={I18n.t('Cancel', {}, '取消')}
//         okText={I18n.t('Application', {}, '应用')}
//         moreTitle={I18n.t('More Filters', {}, '更多筛选')}
//         moreText={I18n.t('More Filters', {}, '更多筛选')}
//         values={values}
//         onChange={e => {
//           setValues(e);
//           // 背后改ref的参数
//           // page相关要从头开始
//           commonState.statelessPropsRef.current.pagination.currentPage = 1;
//           // commonState.statelessPropsRef.current.filter = e;
//           console.log(
//             { ...commonState.statelessPropsRef.current.filter },
//             e,
//             'commonState.statelessPropsRef.current.filter'
//           );

//           Object.assign(commonState.statelessPropsRef.current.filter, {
//             ...omit(e, ['OrderBy', 'IsDesc']),
//           });

//           console.log({ ...commonState.statelessPropsRef.current.filter }, 'after');

//           // 触发搜索
//           commonState.statelessPropsRef.current.trigger?.();
//         }}
//       />
//     </>
//   );
// };

// export const StandarSorter: React.FC<{
//   className?: string;
// }> = ({ className }) => {
//   const commonState = React.useContext(ctx);
//   const len = Object.keys(commonState).length;
//   React.useEffect(() => {
//     if (!len) {
//       console.error('StandarForm must place in StandarSearchTableProvider!');
//     }
//   }, [len]);
//   // const [values, setValues] = React.useState<Record<string, any>>(commonState.initialValues || { displayType: DISPLAY_TYPE, sortType: SORT_TYPE });
//   // commonState.statelessPropsRef.current.resetFormValues = () => {
//   //   // ui上的重置
//   //   setDisplay(initialValues.display || commonState.initialValues || {});
//   //   setSort(initialValues || commonState.initialValues || {});
//   // };
//   return (
//     <AuditSemiReactSortBtn
//       onChange={(e): void => {
//         // setValues(e);
//         // 背后改ref的参数
//         // page相关要从头开始
//         const IsDesc = e.sort === 'descend';
//         commonState.statelessPropsRef.current.pagination.currentPage = 1;
//         Object.assign(commonState.statelessPropsRef.current.filter, {
//           IsDesc: IsDesc ? 1 : 0,
//           OrderBy: e.display === 'VerifyTime' ? 1 : 0,
//         });
//         // 触发搜索
//         commonState.statelessPropsRef.current.trigger?.();
//       }}
//       className={className}
//       displayType={DISPLAY_TYPE}
//       defaultSort={'descend'}
//       sortType={SORT_TYPE}
//     />
//   );
// };

// export const StandarTable: React.FC<
// React.ComponentProps<typeof Table> & {
//   standarTableApi?(apis: StandarTableApi): void;
// }
// > = props => {
//   const commonState = React.useContext(ctx);
//   const len = Object.keys(commonState).length;
//   React.useEffect(() => {
//     if (!len) {
//       console.error('StandarTable must place in StandarSearchTableProvider!');
//     }
//   }, [len]);
//   const {
//     standarTableApi = () => {
//       //
//     },
//   } = props;
//   const [dataSource, setDataSource] = React.useState([]);
//   const [pagination, setPagination] = React.useState<Partial<typeof commonState['pagination']>>({});
//   const [loading, setLoading] = React.useState(false);
//   standarTableApi({
//     commitSearch: commonState.statelessPropsRef.current.trigger,
//     get filter() {
//       return commonState.statelessPropsRef.current.filter;
//     },
//     get pagination() {
//       return commonState.statelessPropsRef.current.pagination;
//     },
//     getData() {
//       return dataSource;
//     },
//     get total() {
//       return pagination.total;
//     },
//     reset() {
//       // page数据上的重置
//       Object.assign(commonState.statelessPropsRef.current.pagination, commonState.defaultPagination || {});
//       // form数据上的重置
//       commonState.statelessPropsRef.current.filter = commonState.initialValues || {};
//       // 重置ui
//       commonState.statelessPropsRef.current.resetFormValues?.();
//       // commonState.statelessPropsRef.current.trigger();
//     },
//   });
//   React.useEffect(() => {
//     // 搜索的具体实现
//     commonState.statelessPropsRef.current.trigger = cb => {
//       setLoading(true);
//       commonState.statelessPropsRef.current.doSearch(
//         {
//           ...pick(commonState.statelessPropsRef.current.pagination, ['pageSize', 'currentPage']),
//           ...commonState.statelessPropsRef.current.filter,
//         },
//         ({ data, total }) => {
//           cb?.({ data, total });
//           setPagination({ ...commonState.statelessPropsRef.current.pagination, total: Number(total) });
//           setDataSource(data);
//           setLoading(false);
//         }
//       );
//     };
//   }, [commonState.statelessPropsRef.current.doSearch, commonState.statelessPropsRef]);
//   React.useEffect(() => {
//     commonState.statelessPropsRef.current.trigger();
//   }, [commonState.statelessPropsRef]);

//   const handleChange = async (key: 'currentPage' | 'pageSize', value) => {
//     setLoading(true);
//     Object.assign(commonState.statelessPropsRef.current.pagination, { [key]: value });
//     commonState.statelessPropsRef.current.doSearch(
//       {
//         ...pick(commonState.statelessPropsRef.current.pagination, ['pageSize', 'currentPage']),
//         [key]: value,
//         ...(commonState.statelessPropsRef.current.filter || {}),
//       },
//       ({ data, total }) => {
//         setPagination({ ...commonState.statelessPropsRef.current.pagination, total: Number(total) });
//         setDataSource(data);
//         setLoading(false);
//       }
//     );
//   };
//   return (
//     <Table
//       {...props}
//       loading={loading}
//       dataSource={dataSource}
//       pagination={{
//         ...pagination,
//         ...{
//           showSizeChanger: true,
//           onPageChange: currentPage => handleChange('currentPage', currentPage),
//           onPageSizeChange: pageSize => handleChange('pageSize', pageSize),
//         },
//       }}
//     />
//   );
// };

// interface MappingConf {
//   onChangeKey?: string;
//   valuesKey?: string;
//   initialValuesKey?: string;
//   onChange?(v, currentParams): void;
// }
// export const withStandard = (C, mapping: MappingConf) => props => {
//   const commonState = React.useContext(ctx);
//   const [values, setValues] = React.useState(props[mapping.initialValuesKey || 'initialValues']);
//   return (
//     <C
//       {...props}
//       {...{
//         [mapping.valuesKey || 'values']: values,
//         [mapping.onChangeKey || 'onChange']: v => {
//           setValues(v);
//           mapping.onChange?.(v, commonState.statelessPropsRef.current);
//         },
//       }}
//     />
//   );
// };

// const AuditSemiReactSortBtnWrapped = props => (
//   <AuditSemiReactSortBtn displayType={DISPLAY_TYPE} sort={'descend'} sortType={SORT_TYPE} {...props} />
// );

// export const StandarSorter1 = withStandard(AuditSemiReactSortBtnWrapped, {
//   onChange(e, current) {
//     const IsDesc = e.sort === 'descend';
//     current.pagination.currentPage = 1;
//     Object.assign(current.filter, {
//       IsDesc: IsDesc ? 1 : 0,
//       OrderBy: e.display === 'VerifyTime' ? 1 : 0,
//     });
//     // 触发搜索
//     current.trigger?.();
//   },
// });

// const FilterWrapped = props => (
//   <SemiReactFilter
//     cancelText={I18n.t('Cancel', {}, '取消')}
//     okText={I18n.t('Application', {}, '应用')}
//     moreTitle={I18n.t('More Filters', {}, '更多筛选')}
//     moreText={I18n.t('More Filters', {}, '更多筛选')}
//     {...props}
//   />
// );

// export const StandarForm1 = withStandard(FilterWrapped, {
//   onChange(e, current) {
//     // 背后改ref的参数
//     // page相关要从头开始
//     current.pagination.currentPage = 1;
//     // commonState.statelessPropsRef.current.filter = e;
//     console.log({ ...current.filter }, e, '.d.current.filter');

//     Object.assign(current.filter, {
//       ...omit(e, ['OrderBy', 'IsDesc']),
//     });

//     console.log({ ...current.filter }, 'after');

//     // 触发搜索
//     current.trigger?.();
//   },
// });

// export default StandarSearchTableProvider;
