import '../styles.css';

//Will return name, positions, & 3 buttons on a single line
//Will also return description accessable via a dropdown menu (accessed via 1 of the buttons)
export const RoleListing = (props) => {
  const toggleDescription = (i) => {
    let roleListing = document.getElementById('role-' + i);
    roleListing ? roleListing.classList.toggle('role-list-description') : console.log('cannot find listing');
  }

  const toggleEdit = (i) => {
    let listParent = document.getElementById('role-list-' + i);
    let descParent = document.getElementById('role-desc-' + i);

    //The below errors are due to typescript. It would take so many different checks to make sure they're not 'undefined', so I'm not doing them.
    listParent.querySelector('.role-list-name').classList.toggle('hide');
    listParent.querySelector('.role-list-num').classList.toggle('hide');
    listParent.querySelector('.role-list-edit').classList.toggle('hide');
    listParent.querySelector('.role-list-name-edit-hide').classList.toggle('role-show');
    listParent.querySelector('.role-list-num-edit-hide').classList.toggle('role-show');
    listParent.querySelector('.role-list-done-hide').classList.toggle('role-show');

  }
  
  let currentRole: {Role: string, amount: number, description: string} = props.role
  return(
    <>
    <div id={'role-list-' + props.num}className='role-list-info'>
      <span className='role-list-name'>{currentRole.Role}</span>
      <input type='text' className='role-list-name-edit-hide' defaultValue={currentRole.Role}/>
      <span className='role-list-num'>{currentRole.amount}</span>
      <input type='number' className='role-list-num-edit-hide' defaultValue={currentRole.amount}/>
      <button className='role-list-desc-dropdown' onClick={() => toggleDescription(props.num)}>V</button>
      <button className='role-list-edit' onClick={() => toggleEdit(props.num)}>edit</button>
      <button className='role-list-done-hide' onClick={() => toggleEdit(props.num)}>done</button>
      <button className='role-list-delete'>X</button>
    </div>
    <div id={'role-desc-' + props.num} className='hide'>
      {currentRole.description}
    </div>
    <textarea id={'role-desc-edit-' + props.num} className='hide' defaultValue={currentRole.description}/>
    </>
  )
}