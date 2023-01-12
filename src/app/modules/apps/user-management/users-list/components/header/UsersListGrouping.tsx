import {useQueryClient} from 'react-query';
import {useListView} from '../../core/ListViewProvider';
import {useQueryResponse} from '../../core/QueryResponseProvider';
import useNotification from "@/app/modules/notifications/useNotification";

const UsersListGrouping = () => {
  const {selected, clearSelected} = useListView();
  const queryClient = useQueryClient();
  const {query} = useQueryResponse();
  const {setNotification} = useNotification();

  const deleteSelectedItems = () => {
    setNotification(true, 'Under development', 'info', () => {});
  }

  return (
    <div className='d-flex justify-content-end align-items-center'>
      <div className='fw-bolder me-5'>
        <span className='me-2'>{selected.length}</span> Selected
      </div>

      <button
        type='button'
        className='btn btn-danger'
        onClick={deleteSelectedItems}
      >
        Delete Selected
      </button>
    </div>
  );
};

export {UsersListGrouping};
