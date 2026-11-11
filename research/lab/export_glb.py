# Export the reference-matched static reading pose for inspection in WebGL.
# It is NOT a complete page-turning rig. Excludes the lighting rig and floor.
import bpy
from pathlib import Path

root=Path(r'E:\INM-3D-Book')
lab=root/'prototype-photoreal'/'reference-matched-v2'
bpy.ops.wm.open_mainfile(filepath=str(lab/'INM-reference-v2-oblique.blend'))
for obj in bpy.context.scene.objects:
    obj.select_set(False)
selection=[]
for ob in list(bpy.context.scene.objects):
    if ob.type not in {'MESH','CURVE'}:
        continue
    if ob.name.startswith('warm studio surface'):
        continue
    if ob.type=='CURVE':
        bpy.ops.object.select_all(action='DESELECT')
        ob.select_set(True);bpy.context.view_layer.objects.active=ob
        bpy.ops.object.convert(target='MESH')
        ob=bpy.context.view_layer.objects.active
    selection.append(ob)
bpy.ops.object.select_all(action='DESELECT')
for ob in selection:ob.select_set(True)
bpy.context.view_layer.objects.active=selection[0]
out=lab/'inm-open-reference.glb'
bpy.ops.export_scene.gltf(
    filepath=str(out),
    export_format='GLB',
    use_selection=True,
    export_apply=True,
    export_yup=True,
    export_materials='EXPORT',
    export_image_format='JPEG',
    export_lights=False,
    export_cameras=False,
    export_animations=False,
)
print('EXPORTED',out,out.stat().st_size,'meshes',len(selection),flush=True)
