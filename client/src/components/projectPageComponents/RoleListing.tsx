import '../styles.css';

//Will return name, positions, & 3 buttons on a single line
//Will also return description accessable via a dropdown menu (accessed via 1 of the buttons)
export const RoleListing = (props) => {
  let editMode = false;
  let descHidden = true;
  const toggleDescription = (i) => {
    descHidden = !descHidden;
    if (!editMode) {
      let roleListing = document.getElementById('role-desc-' + i);
      roleListing ? roleListing.classList.toggle('role-list-description') : console.log('cannot find listing');
    } else {
      let roleInput = document.getElementById('role-desc-edit-' + i);
      roleInput ? roleInput.classList.toggle('role-list-desc-input') : console.log('cannot find listing');
    }
  }

  const toggleEdit = (i) => {
    editMode = !editMode;

    let listParent = document.getElementById('role-list-' + i);
    let desc = document.getElementById('role-desc-' + i);
    let descInput = document.getElementById('role-desc-edit-' + i);

    //The below errors are due to typescript. It would take so many different checks to make sure they're not 'undefined', so I'm not doing them.
    listParent.querySelector('.role-list-name').classList.toggle('hide');
    listParent.querySelector('.role-list-num').classList.toggle('hide');
    listParent.querySelector('.role-list-edit').classList.toggle('hide');
    listParent.querySelector('.role-list-name-edit-hide').classList.toggle('role-show');
    listParent.querySelector('.role-list-num-edit-hide').classList.toggle('role-show');
    listParent.querySelector('.role-list-done-hide').classList.toggle('role-show');

    if (!descHidden) {
      desc ? desc.classList.toggle('role-list-description') : console.log('cannot find listing');
      descInput ? descInput.classList.toggle('role-list-desc-input') : console.log('cannot find listing');
    }
  }

  const removeRole = (roleIndex) => {
    //Add cover to element here
    console.log('removing role');
    props.removeRole(roleIndex);
  }

  const doneEdit = (roleIndex) => {
    let listParent = document.getElementById('role-list-' + roleIndex);
    let roleName, roleNum, roleDesc;
    roleName = listParent.querySelector('.role-list-name-edit-hide').value;
    roleNum = listParent.querySelector('.role-list-num-edit-hide').value;
    roleDesc = document.getElementById('role-desc-edit-' + roleIndex).value;
    //Update displays with new info
    listParent.querySelector('.role-list-name').innerHTML = roleName;
    listParent.querySelector('.role-list-num').innerHTML = roleNum;
    document.getElementById('role-desc-' + roleIndex).innerHTML = roleDesc;
    let roleObject: {Role: string, amount: number, description: string} =
      {Role: roleName, amount: roleNum, description: roleDesc};
    toggleEdit(roleIndex);
    props.updateRoleSettings(roleIndex, roleObject);
  }
  
  let currentRole: {Role: string, amount: number, description: string} = props.role

  return(
    <>
    <div id={'role-list-' + props.num} className='role-list-info'>
      <span className='role-list-name'>{currentRole.Role}</span>
      <input type='text' className='role-list-name-edit-hide' defaultValue={currentRole.Role}/>
      <span className='role-list-num'>{currentRole.amount}</span>
      <input type='number' className='role-list-num-edit-hide' defaultValue={currentRole.amount}/>
      <button className='role-list-desc-dropdown' onClick={() => toggleDescription(props.num)}>V</button>
      <button className='role-list-edit' onClick={() => toggleEdit(props.num)}>edit</button>
      <button className='role-list-done-hide' onClick={() => doneEdit(props.num)}>done</button>
      <button className='role-list-delete' onClick={() => removeRole(props.num)}>X</button>
    </div>
    <div id={'role-desc-' + props.num} className='hide'>
      {currentRole.description}
    </div>
    <textarea id={'role-desc-edit-' + props.num} className='hide' defaultValue={currentRole.description}/>
    </>
  )
}